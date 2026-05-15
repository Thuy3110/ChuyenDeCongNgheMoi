from django.core.mail import send_mail

def send_reminder_email(user_email, class_name, time_text):
    send_mail(
        subject="⏰ Nhắc lịch học Yoga",
        message=f"""
Xin chào,

Bạn có lớp học sắp diễn ra:

📚 Lớp: {class_name}
⏰ Thời gian: {time_text}

Vui lòng tham gia đúng giờ.

Trân trọng,
Yoga System
        """,
        from_email="thuydreamcatcher@gmail.com",
        recipient_list=[user_email],
        fail_silently=False,
    )