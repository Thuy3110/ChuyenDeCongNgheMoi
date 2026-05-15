from django.shortcuts import render
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.schedules.models import Schedule   # ✅ FIX
from django.core.mail import send_mail
from .models import Attendance
from apps.booking.models import Enrollment
from apps.notifications.models import Notification


class AttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        enrollment_id = request.data.get("enrollment_id")
        schedule_id = request.data.get("schedule_id")
        status_value = request.data.get("status")   # ✅ FIX

        if not enrollment_id or not schedule_id or not status_value:
            return Response({"error": "Thiếu dữ liệu!"}, status=400)

        # ✅ FIX chuẩn hóa status
        status_value = status_value.lower()

        try:
            enrollment = Enrollment.objects.get(id=enrollment_id)
            schedule = Schedule.objects.get(id=schedule_id)
        except Enrollment.DoesNotExist:
            return Response({"error": "Không tìm thấy enrollment"}, status=404)
        except Schedule.DoesNotExist:
            return Response({"error": "Không tìm thấy schedule"}, status=404)

        today = timezone.now().date()

        if Attendance.objects.filter(
            enrollment=enrollment,
            schedule=schedule,
            date=today
        ).exists():
            return Response({"error": "Buổi này đã điểm danh rồi!"}, status=400)

        Attendance.objects.create(
            enrollment=enrollment,
            schedule=schedule,
            date=today,
            status=status_value
        )

        if status_value == "present":
            message = "Bạn đã được điểm danh có mặt hôm nay."
        else:
            message = "Bạn đã bị ghi nhận vắng mặt hôm nay."

        Notification.objects.create(
            user=enrollment.user,
            title="Điểm danh lớp học",
            message=message
        )

        student_email = enrollment.user.email
        student_name = enrollment.user.username

        if status_value == "present":
            subject = "Yoga Class - Điểm danh"
            message = f"""
Xin chào {student_name},

Bạn đã được ghi nhận: CÓ MẶT trong buổi học hôm nay.

Chúc bạn tập luyện hiệu quả!
"""
        else:
            subject = "Yoga Class - Điểm danh"
            message = f"""
Xin chào {student_name},

Bạn đã được ghi nhận: VẮNG MẶT trong buổi học hôm nay.

Vui lòng theo dõi lịch học của bạn.
"""

        send_mail(
            subject,
            message,
            "thuydreamcatcher@gmail.com",
            [student_email],
            fail_silently=True
        )

        return Response({"message": "Điểm danh thành công!"})


class AttendanceHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "trainer":
            records = Attendance.objects.filter(
                enrollment__yoga_class__trainer=user
            )
        else:
            records = Attendance.objects.filter(
                enrollment__user=user
            )

        data = []
        for r in records:
            data.append({
                "student_name": r.enrollment.user.username,
                "class_name": r.enrollment.yoga_class.name,
                "date": r.date,
                "status": r.status,
                "weekday": r.schedule.get_weekday_display(),
                "start_time": r.schedule.start_time,
                "end_time": r.schedule.end_time,
            })

        return Response(data)


class TrainerTodayAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "trainer":
            return Response({"error": "Không có quyền"}, status=403)

        today = timezone.now().date()
        today_weekday = timezone.now().weekday()

        enrollments = Enrollment.objects.filter(
            yoga_class__trainer=user,
            status="approved"
        )

        data = []
        added = set()

        for e in enrollments:
            schedules = e.yoga_class.schedules.filter(
                weekday=today_weekday
            )

            for s in schedules:
                key = f"{e.id}-{s.id}"

                if key in added:
                    continue

                added.add(key)

                attendance = Attendance.objects.filter(
                    enrollment=e,
                    schedule=s,
                    date=today
                ).first()

                data.append({
                    "enrollment_id": e.id,
                    "schedule_id": s.id,
                    "student_name": e.user.username,
                    "class_name": e.yoga_class.name,
                    "weekday": s.get_weekday_display(),
                    "start_time": s.start_time.strftime("%H:%M"),
                    "end_time": s.end_time.strftime("%H:%M"),
                    "attendance_status": attendance.status if attendance else None,
                })

        return Response(data)


class MyAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        attendance = Attendance.objects.filter(enrollment__user=user)  # ✅ FIX

        total = attendance.count()
        present = attendance.filter(status="present").count()
        absent = attendance.filter(status="absent").count()

        return Response({
            "total": total,
            "present": present,
            "absent": absent,
            "data": attendance.values(
                "id",
                "date",
                "status",
                "enrollment__yoga_class__name"  # ✅ FIX
            )
        })


class MemberAttendanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        records = Attendance.objects.filter(enrollment__user=user)

        total = records.count()
        present = records.filter(status="present").count()
        absent = records.filter(status="absent").count()

        data = []
        for r in records:
            data.append({
                "class_name": r.enrollment.yoga_class.name,
                "date": r.date,
                "status": r.status,
            })

        return Response({
            "total_sessions": total,
            "attended": present,
            "absent": absent,
            "records": data
        })
class TrainerStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "trainer":
            return Response({"error": "Không có quyền"}, status=403)

        enrollments = Enrollment.objects.filter(
            yoga_class__trainer=user,
            status="approved"
        ).select_related("user", "yoga_class")

        data = []

        for e in enrollments:
            data.append({
                "id": e.id,
                "student_name": e.user.username,
                "email": e.user.email,
                "class_name": e.yoga_class.name,
                "status": e.status,
            })

        return Response(data)