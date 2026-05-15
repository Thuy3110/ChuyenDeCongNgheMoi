from django.contrib import admin
from .models import Schedule


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "yoga_class", "get_weekday", "start_time", "end_time")
    list_filter = ("weekday",)
    search_fields = ("yoga_class__name",)
    ordering = ("weekday",)

    def get_weekday(self, obj):
        return obj.get_weekday_display()

    # get_weekday.short_description = "Thứ"