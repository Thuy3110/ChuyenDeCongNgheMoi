from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, TrainerStudentsView
from django.urls import path

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = router.urls + [
    path("trainer/students/", TrainerStudentsView.as_view()),
]