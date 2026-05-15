from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.classes.models import Class
from apps.schedules.models import Schedule
from apps.users.models import User

from apps.classes.serializers import ClassSerializer
from apps.schedules.serializers import ScheduleSerializer
from apps.users.serializers import UserSerializer


class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        keyword = request.GET.get("search", "")

        # ===== CLASSES =====
        classes = Class.objects.filter(name__icontains=keyword)

        # ===== TRAINER SEARCH =====
        trainers = User.objects.filter(
            role="trainer",
            username__icontains=keyword
        )

        # ===== STUDENT SEARCH =====
        students = User.objects.filter(
            role="member",
            username__icontains=keyword
        )

        # ===== SCHEDULE =====
        schedules = Schedule.objects.filter(
            yoga_class__name__icontains=keyword
        )

        return Response({
            "classes": ClassSerializer(classes, many=True).data,
            "trainers": [{"id": t.id, "name": t.username} for t in trainers],
            "students": [{"id": s.id, "name": s.username} for s in students],
            "schedules": ScheduleSerializer(schedules, many=True).data,
        })