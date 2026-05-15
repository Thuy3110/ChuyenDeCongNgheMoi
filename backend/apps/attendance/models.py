from django.db import models
from apps.schedules.models import Schedule
class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
    )

    enrollment = models.ForeignKey(
        'booking.Enrollment',  # Tránh import trực tiếp
        on_delete=models.CASCADE,
        related_name='attendances'
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='present'
    )
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, default=1)
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('enrollment', 'schedule', 'date')

    def __str__(self):
        return f"{self.enrollment} - {self.status}"