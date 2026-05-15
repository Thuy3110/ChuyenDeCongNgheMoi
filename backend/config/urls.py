from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.http import HttpResponse


def home(request):
    return HttpResponse("Backend Yoga API is running 🚀")


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),

    # AUTHENTICATION
    path('api/auth/', include('apps.users.urls')),
    # path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/", include("core.urls")),
    # MODULES
    path('api/attendance/', include('apps.attendance.urls')),
    path('api/classes/', include('apps.classes.urls')),
    path('api/booking/', include('apps.booking.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/schedules/', include('apps.schedules.urls')),
    path("api/notifications/", include("apps.notifications.urls")),
    path('api/users/', include('apps.users.urls')),
]