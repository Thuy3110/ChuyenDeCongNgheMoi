from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta
from apps.booking.models import Enrollment
from apps.schedules.models import Schedule
from .email_utils import send_reminder_email
@shared_task
def send_reminders():
    now = timezone.now()

    enrollments = Enrollment.objects.filter(status="approved")

    for e in enrollments:
        schedules = Schedule.objects.filter(yoga_class=e.yoga_class)

        for s in schedules:
            class_time = datetime.combine(now.date(), s.start_time)
            class_time = timezone.make_aware(class_time)

            diff = class_time - now

            time_text = f"{s.start_time} - {s.end_time}"

            # ⏰ 24h trước
            if timedelta(hours=23, minutes=50) <= diff <= timedelta(hours=24, minutes=10):
                send_reminder_email(
                    e.user.email,
                    e.yoga_class.name,
                    time_text
                )

            # ⏰ 1h trước
            if timedelta(minutes=50) <= diff <= timedelta(hours=1, minutes=10):
                send_reminder_email(
                    e.user.email,
                    e.yoga_class.name,
                    time_text
                )