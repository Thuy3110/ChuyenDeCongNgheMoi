from django.urls import path
from .views import AdminDashboardView,TrainerDashboardView,  MemberDashboardView

urlpatterns = [
    path("admin/",AdminDashboardView.as_view()
    ),
    path("trainer/", TrainerDashboardView.as_view()),
    path("member/", MemberDashboardView.as_view()),
]