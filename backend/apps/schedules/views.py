from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend

from datetime import datetime

from .models import Schedule
from .serializers import ScheduleSerializer
from apps.classes.models import Class


# helper
def is_overlap(start1, end1, start2, end2):
    return start1 < end2 and start2 < end1


def parse_time(t):
    if isinstance(t, str):
        return datetime.strptime(t, "%H:%M").time()
    return t


class ScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'admin':
            schedules = Schedule.objects.all()

        elif user.role == 'trainer':
            schedules = Schedule.objects.filter(yoga_class__trainer=user)

        else:
            from apps.booking.models import Enrollment

            enrolled_classes = Enrollment.objects.filter(
                user=user,
                status='approved'
            ).values_list('yoga_class_id', flat=True)

            schedules = Schedule.objects.filter(
                yoga_class_id__in=enrolled_classes
            ).distinct()

        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    # =========================
    # FIX TRÙNG PHÒNG + TRÙNG GIỜ + TRÙNG NGÀY
    # =========================
    def post(self, request):
        data = request.data

        yoga_class_id = data.get("yoga_class")
        weekday = data.get("weekday")
        start_time = parse_time(data.get("start_time"))
        end_time = parse_time(data.get("end_time"))

        try:
            cls = Class.objects.get(id=yoga_class_id)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=404)

        room = cls.room

        # check tất cả schedule cùng phòng + ngày
        conflict = Schedule.objects.filter(
            yoga_class__room=room,
            weekday=weekday
        )

        for s in conflict:
            if is_overlap(start_time, end_time, s.start_time, s.end_time):
                return Response(
                    {"error": "Phòng đã bị trùng lịch trong khung giờ này"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = ScheduleSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class TrainerScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    filterset_fields = [
        'yoga_class',
        'yoga_class__trainer',
        'weekday',
    ]

    search_fields = [
        'yoga_class__name',
        'yoga_class__trainer__username',
        'yoga_class__trainer__first_name',
        'yoga_class__trainer__last_name',
    ]

    def get_queryset(self):
        user = self.request.user

        if user.role == "trainer":
            return Schedule.objects.filter(
                yoga_class__trainer=user
            ).select_related("yoga_class", "yoga_class__trainer")

        return Schedule.objects.none()

    # =========================
    # FIX TRÙNG LỊCH TRAINER + ROOM + TIME
    # =========================
    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "trainer":
            raise PermissionDenied("Chỉ trainer được tạo lịch")

        yoga_class = serializer.validated_data["yoga_class"]

        if yoga_class.trainer != user:
            raise PermissionDenied("Không được tạo lịch cho lớp người khác")

        weekday = serializer.validated_data["weekday"]
        start_time = serializer.validated_data["start_time"]
        end_time = serializer.validated_data["end_time"]

        schedules = Schedule.objects.filter(
            yoga_class__trainer=user,
            weekday=weekday
        )

        for s in schedules:
            if is_overlap(start_time, end_time, s.start_time, s.end_time):
                raise PermissionDenied("Trùng lịch dạy")

        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user

        if user.role != "trainer":
            raise PermissionDenied("Không có quyền sửa")

        if serializer.instance.yoga_class.trainer != user:
            raise PermissionDenied("Không được sửa lịch người khác")

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user

        if user.role != "trainer":
            raise PermissionDenied("Không có quyền xóa")

        if instance.yoga_class.trainer != user:
            raise PermissionDenied("Không được xóa lịch người khác")

        if instance.yoga_class.enrollments.exists():
            raise PermissionDenied("Lớp đã có học viên")

        instance.delete()