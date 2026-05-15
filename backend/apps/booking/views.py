from apps.schedules.models import Schedule
from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment
from .serializers import EnrollmentSerializer
from django.utils import timezone
from apps.attendance.models import Attendance
from datetime import datetime
from rest_framework.decorators import action
from rest_framework import status


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Enrollment.objects.filter(user=user)
        return qs.order_by("status", "waitlist_position", "-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        yoga_class = serializer.validated_data["yoga_class"]

        # ❌ 1. Check trùng đăng ký
        existing = Enrollment.objects.filter(
            user=user,
            yoga_class=yoga_class
        ).first()

        # ⭐ FIX: nếu đã tồn tại
        if existing:

            # ✔ CASE: đang waitlist nhưng còn slot → upgrade lên enrolled
            if existing.status == Enrollment.WAITLIST and yoga_class.available_slots() > 0:
                existing.status = "approved"
                existing.waitlist_position = None
                existing.save()

                # promote lại waitlist
                self.promote_waitlist(yoga_class)

                return existing

            # ❌ đã tồn tại bình thường
            raise ValidationError("Bạn đã đăng ký lớp học này!")

        # ❌ 2. Check lớp đã kết thúc
        today = timezone.now().date()
        if yoga_class.end_date and yoga_class.end_date.date() < today:
            raise ValidationError("Lớp học này đã kết thúc!")

        # ❌ 3. Check trùng lịch
        enrolled_classes = Enrollment.objects.filter(
            user=user,
            status='approved'
        ).values_list('yoga_class', flat=True)

        new_schedules = Schedule.objects.filter(yoga_class=yoga_class)
        existing_schedules = Schedule.objects.filter(
            yoga_class__in=enrolled_classes
        )

        for new in new_schedules:
            for old in existing_schedules:
                if new.weekday == old.weekday:
                    if new.start_time < old.end_time and new.end_time > old.start_time:
                        raise ValidationError("Trùng lịch với lớp khác!")

        # ❌ 4. Giới hạn lớp/ngày
        MAX_CLASSES_PER_DAY = 2

        for new_schedule in new_schedules:
            count_same_day = Enrollment.objects.filter(
                user=user,
                status='approved',
                yoga_class__schedules__weekday=new_schedule.weekday
            ).distinct().count()

            if count_same_day >= MAX_CLASSES_PER_DAY:
                raise ValidationError(
                    f"Bạn chỉ được tối đa {MAX_CLASSES_PER_DAY} lớp/ngày!"
                )

        # ⭐ 5. CHECK SLOT
        available = yoga_class.available_slots()

        # ====== WAITLIST ======
        if available <= 0:
            last_position = Enrollment.objects.filter(
                yoga_class=yoga_class,
                status=Enrollment.WAITLIST
            ).count()

            return serializer.save(
                user=user,
                status=Enrollment.WAITLIST,
                waitlist_position=last_position + 1
            )

        # ====== NORMAL ENROLL ======
        return serializer.save(
            user=user,
            status="approved"   # ⭐ FIX: nên dùng approved thay vì pending nếu hệ bạn là enrolled
        )

    # ================= CANCEL =================
    @action(detail=True, methods=["delete"])
    def cancel(self, request, pk=None):
        enrollment = self.get_object()
        yoga_class = enrollment.yoga_class

        now = timezone.now()

        # ❌ FIX: chỉ check theo start_date
        if yoga_class.start_date and yoga_class.start_date <= now:
            return Response(
                {"detail": "Không thể hủy khi lớp đã bắt đầu"},
                status=400
            )

        enrollment.delete()

        self.promote_waitlist(yoga_class)

        return Response({"detail": "Đã hủy đăng ký"})

    # ================= PROMOTE WAITLIST =================
    def promote_waitlist(self, yoga_class):
        available = yoga_class.available_slots()

        if available <= 0:
            return

        waitlist_users = Enrollment.objects.filter(
            yoga_class=yoga_class,
            status="waitlist"
        ).order_by("created_at")[:available]

        for e in waitlist_users:
            e.status = "approved"
            e.waitlist_position = None
            e.save()
            self.notify_user(
            e.user,
            f"Bạn đã được chuyển sang ENROLLED lớp {yoga_class.name}"
        )
        # ⭐ reorder lại waitlist
        remaining = Enrollment.objects.filter(
            yoga_class=yoga_class,
            status="waitlist"
        ).order_by("created_at")

        for idx, e in enumerate(remaining, start=1):
            e.waitlist_position = idx
            e.save()

class TrainerStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'trainer':
            return Response({"error": "Không có quyền"}, status=403)

        today = timezone.now().date()
        today_weekday = (timezone.now().weekday() + 1) % 7  # 🔥 FIX

        enrollments = Enrollment.objects.filter(
            yoga_class__trainer=user,
            status='approved'
        )

        data = []

        for e in enrollments:
            schedules = e.yoga_class.schedules.filter(
                weekday=today_weekday
            )

            for s in schedules:
                attendance = Attendance.objects.filter(
                    enrollment=e,
                    schedule=s,
                    date=today
                ).first()

                data.append({
                    "id": e.id,
                    "schedule_id": s.id,
                    "student_name": e.user.username,
                    "class_name": e.yoga_class.name,
                    "weekday": s.get_weekday_display(),

                    # ✅ FIX TIME
                    "start_time": s.start_time.strftime("%H:%M"),
                    "end_time": s.end_time.strftime("%H:%M"),

                    "attendance_status": attendance.status if attendance else None,
                })

        return Response(data)