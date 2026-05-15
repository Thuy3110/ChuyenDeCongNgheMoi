from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("id", "enrollment", "status")
    list_filter = ("status",)
    search_fields = ("enrollment__user__username",)
    ordering = ("id",)