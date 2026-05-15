from rest_framework import serializers
from .models import Class,Room
from apps.schedules.models import Schedule

class ClassSerializer(serializers.ModelSerializer):

    trainer_name = serializers.SerializerMethodField()
    trainer_username = serializers.CharField(source="trainer.username", read_only=True)

    available_slots = serializers.SerializerMethodField()
    schedules = serializers.SerializerMethodField()

    # ROOM
    room = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(),
        required=False,
        allow_null=True
    )

    room_name = serializers.CharField(source="room.name", read_only=True)
    room_id = serializers.IntegerField(source="room.id", read_only=True)

    class Meta:
        model = Class
        fields = [
            "id",
            "name",
            "description",
            "schedules",

            "trainer",
            "trainer_name",
            "trainer_username",

            "room",
            "room_name",
            "room_id",

            "start_date",
            "end_date",
            "max_slots",
            "max_students",
            "available_slots",
        ]

    def get_schedules(self, obj):
        schedules = Schedule.objects.filter(yoga_class=obj)

        return [
            {
                "id": s.id,
                "weekday": s.weekday,
                "weekday_display": s.get_weekday_display(),
                "start_time": s.start_time,
                "end_time": s.end_time,
            }
            for s in schedules
        ]
    
    def get_trainer_name(self, obj):
        if obj.trainer:
            full_name = f"{obj.trainer.first_name} {obj.trainer.last_name}".strip()
            return full_name if full_name else obj.trainer.username
        return "Chưa có HLV"

    def get_available_slots(self, obj):
        from apps.booking.models import Enrollment
        approved_count = Enrollment.objects.filter(
            yoga_class=obj,
            status="approved"
        ).count()
        return obj.max_slots - approved_count
    def validate(self, data):
        room = data.get("room")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not room or not start_date or not end_date:
            return data

        # check conflict schedule
        conflict = Class.objects.filter(
            room=room,
            start_date__lt=end_date,
            end_date__gt=start_date
        )

        # nếu đang update thì loại chính nó ra
        if self.instance:
            conflict = conflict.exclude(id=self.instance.id)

        if conflict.exists():
            raise serializers.ValidationError({
                "room": "Phòng này đã bị trùng lịch trong khoảng thời gian này"
            })

        return data
    
class YogaClassSerializer(serializers.ModelSerializer):

    trainer_name = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = [
            "id",
            "name",
            "trainer",
            "trainer_name",
            "max_slots"
        ]

    def get_trainer_name(self, obj):

        if obj.trainer:

            full_name = f"{obj.trainer.first_name} {obj.trainer.last_name}".strip()

            return full_name if full_name else obj.trainer.username

        return "Chưa phân công"

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "name", "capacity"]
    