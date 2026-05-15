from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduleView, TrainerScheduleViewSet

router = DefaultRouter()
router.register(
    r"trainer/schedules",
    TrainerScheduleViewSet,
    basename="trainer-schedules"
)

urlpatterns = [
    path("", ScheduleView.as_view()),
    path("", include(router.urls)),
]