from django.db import models
from apps.classes.models import Class
from apps.users.models import User
from django.core.exceptions import ValidationError

class Schedule(models.Model):
    WEEKDAYS = (
        (0, "Thứ 2"),
        (1, "Thứ 3"),
        (2, "Thứ 4"),
        (3, "Thứ 5"),
        (4, "Thứ 6"),
        (5, "Thứ 7"),
        (6, "Chủ nhật"),
    )

    yoga_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="schedules"
    )

    weekday = models.IntegerField(choices=WEEKDAYS)  # ⭐ THỨ

    start_time = models.TimeField()
    end_time = models.TimeField()

    trainer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'trainer'},
        related_name="trainer_schedules"
    )
    def clean(self):

        # lấy class hiện tại
        yoga_class = self.yoga_class
        room = yoga_class.room

        if not room:
            return

        # lấy các schedule khác trong cùng phòng
        conflict_schedules = Schedule.objects.filter(
            yoga_class__room=room,
            weekday=self.weekday
        ).exclude(id=self.id)

        for s in conflict_schedules:
            # check overlap time
            if (
                self.start_time < s.end_time and self.end_time > s.start_time
            ):
                raise ValidationError(
                    "Phòng đã bị trùng lịch trong khung giờ này!"
                )
    def __str__(self):
        return f"{self.yoga_class.name} - {self.get_weekday_display()}"