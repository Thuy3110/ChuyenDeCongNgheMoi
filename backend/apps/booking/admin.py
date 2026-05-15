from django.contrib import admin
from .models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "yoga_class",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "yoga_class__name")
    autocomplete_fields = ("user", "yoga_class")
    ordering = ("-created_at",)