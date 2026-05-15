from django.urls import path
from .views import AttendanceView, AttendanceHistoryView,TrainerTodayAttendanceView
from .views import MemberAttendanceSummaryView
from .views import TrainerStudentsView

urlpatterns = [
    path("", AttendanceView.as_view()),
    path("history/", AttendanceHistoryView.as_view()),
    path("attendance/today/", TrainerTodayAttendanceView.as_view()),
    path("member/", MemberAttendanceSummaryView.as_view()),
    path("trainer/students/", TrainerStudentsView.as_view()
),
]