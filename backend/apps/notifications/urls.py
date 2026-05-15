from django.urls import path
from .views import NotificationListView
from .views import (NotificationListView,MarkAllNotificationsReadView)
urlpatterns = [
    path("", NotificationListView.as_view()),
     path(
        'read-all/',
        MarkAllNotificationsReadView.as_view()
    ),
]