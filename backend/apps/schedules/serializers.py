from rest_framework import serializers
from .models import Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(
        source='trainer.username',
        read_only=True
    )

    class_name = serializers.CharField(
        source='yoga_class.name',
        read_only=True
    )
    class_id = serializers.IntegerField(source='yoga_class.id', read_only=True)
    weekday_display = serializers.SerializerMethodField()
    yoga_class_name = serializers.CharField(source="yoga_class.name", read_only=True)
    yoga_class = serializers.PrimaryKeyRelatedField(
    queryset=Schedule._meta.get_field('yoga_class').related_model.objects.all())

    room_name = serializers.CharField(source="yoga_class.room.name", read_only=True)
    room_id = serializers.IntegerField(source="yoga_class.room.id", read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id',
            'yoga_class',
            'class_id',
            'class_name',   
            'room_name',
            'room_id',     
            'weekday',           
            'weekday_display',
            'yoga_class_name',   
            'start_time',        
            'end_time',          
            'trainer_name'       
        ]
    def validate(self, data):
        instance = Schedule(**data)
        instance.clean()
        return data
    
    def get_weekday_display(self, obj):
        return obj.get_weekday_display()