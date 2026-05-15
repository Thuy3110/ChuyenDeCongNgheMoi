from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, LoginView,UserListView
from .views import CustomTokenView

router = DefaultRouter()
router.register(r'crud', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/login/', CustomTokenView.as_view()),
    path('', UserListView.as_view()),
    path('', include(router.urls)),
]