from django.db import models
from django.conf import settings
from apps.classes.models import Class

User = settings.AUTH_USER_MODEL


class Enrollment(models.Model):
    WAITLIST = "waitlist"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (APPROVED, "Approved"),
        (REJECTED, "Rejected"),
        (WAITLIST, "Waitlist"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    yoga_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING
    )

    # ⭐ NEW: vị trí trong waitlist
    waitlist_position = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    def get_waitlist_position(self):
        if self.status != "waitlist":
            return None

        return Enrollment.objects.filter(
            yoga_class=self.yoga_class,
            status="waitlist",
            created_at__lt=self.created_at
        ).count() + 1
    class Meta:
        unique_together = ("user", "yoga_class")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.yoga_class}"