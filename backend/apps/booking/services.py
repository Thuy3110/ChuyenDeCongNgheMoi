from apps.booking.models import Enrollment

def is_class_full(yoga_class, booking_date):
    count = Enrollment.objects.filter(
        yoga_class=yoga_class,
        booking_date=booking_date,
        status='confirmed'
    ).count()

    return count >= yoga_class.max_students