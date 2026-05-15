from django.utils import timezone
from django.db.models import Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.attendance.models import Attendance
from apps.booking.models import Enrollment
from apps.schedules.models import Schedule
from apps.users.models import User
from apps.classes.models import Class


# =========================
# ADMIN DASHBOARD
# =========================

class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role != "admin":
            return Response(
                {"error": "Không có quyền"},
                status=403
            )

        total_classes = Class.objects.count()

        total_trainers = User.objects.filter(
            role="trainer"
        ).count()

        total_members = User.objects.filter(
            role="member"
        ).count()

        return Response({
            "classes": total_classes,
            "trainers": total_trainers,
            "members": total_members,
        })


# =========================
# TRAINER DASHBOARD
# =========================

class TrainerDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role != "trainer":
            return Response(
                {"error": "Không có quyền"},
                status=403
            )

        today = timezone.now().weekday()

        # ✅ Lớp đang dạy
        total_classes = Schedule.objects.filter(
            yoga_class__trainer=user
        ).values('yoga_class').distinct().count()

        # ✅ Học viên
        total_students = Enrollment.objects.filter(
            yoga_class__trainer=user,
            status="approved"
        ).values('user').distinct().count()

        # ✅ Buổi hôm nay
        today_sessions = Schedule.objects.filter(
            yoga_class__trainer=user,
            weekday=today
        ).count()

        return Response({
            "total_classes": total_classes,
            "total_students": total_students,
            "today_sessions": today_sessions
        })


# =========================
# MEMBER DASHBOARD
# =========================

class MemberDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "member":
            return Response({"error": "Không có quyền"}, status=403)

        today = timezone.now().date()
        weekday_today = today.weekday()

        registered_classes = Enrollment.objects.filter(
            user=user,
            status="approved"
        ).values("yoga_class").distinct().count()

        schedules = Schedule.objects.filter(
            yoga_class__enrollments__user=user,
            yoga_class__enrollments__status="approved"
        ).distinct()

        this_week_schedule = schedules.count()

        today_sessions = schedules.filter(
            weekday=weekday_today
        ).count()

        total_attended_sessions = Attendance.objects.filter(
            enrollment__user=user,
            status="present"
        ).count()

        return Response({
            "registered_classes": registered_classes,
            "this_week_schedule": this_week_schedule,
            "today_sessions": today_sessions,
            "total_attended_sessions": total_attended_sessions
        })