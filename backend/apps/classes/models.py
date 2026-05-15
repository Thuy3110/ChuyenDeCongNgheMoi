from django.db import models
from apps.users.models import User


class Class(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    trainer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'trainer'}
    )
    
    room = models.ForeignKey(
        "Room",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes"
    )

    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    max_slots = models.IntegerField(default=10)
    max_students = models.IntegerField(default=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    def available_slots(self):
        from apps.booking.models import Enrollment

        enrolled = Enrollment.objects.filter(
        yoga_class=self,
        status='approved'
    ).count()

        return self.max_slots - enrolled
class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField(default=20)

    def __str__(self):
        return self.name