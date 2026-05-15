from rest_framework import serializers
from .models import Enrollment
from apps.classes.serializers import ClassSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    # Hiển thị chi tiết lớp học
    yoga_class = ClassSerializer(read_only=True)
    waitlist_position = serializers.SerializerMethodField()

    # Dùng khi tạo đăng ký
    yoga_class_id = serializers.PrimaryKeyRelatedField(
        queryset=Enrollment._meta.get_field("yoga_class").related_model.objects.all(),
        source="yoga_class",
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "yoga_class",
            "yoga_class_id",
            "status",
            "waitlist_position",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]
    
    def get_waitlist_position(self, obj):
        return obj.get_waitlist_position()