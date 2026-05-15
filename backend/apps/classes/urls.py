from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainerStudentsView
from .views import ClassViewSet, TrainerClassView,RoomViewSet

router = DefaultRouter()

router.register("classes", ClassViewSet, basename="classes")
router.register("rooms", RoomViewSet, basename="rooms")

urlpatterns = [
    path("", include(router.urls)),
    path("trainer/", TrainerClassView.as_view()),
    path("trainer/students/", TrainerStudentsView.as_view()),
]