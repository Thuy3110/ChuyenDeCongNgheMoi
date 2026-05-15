from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime

from .models import Class, Room
from .serializers import ClassSerializer, RoomSerializer
from apps.booking.models import Enrollment
from apps.schedules.models import Schedule


# =========================
# PERMISSION CUSTOM
# =========================
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


# helper check overlap
def is_overlap(start1, end1, start2, end2):
    return start1 < end2 and start2 < end1


def parse_time(t):
    if isinstance(t, str):
        return datetime.strptime(t, "%H:%M").time()
    return t


# =========================
# CLASS VIEW
# =========================
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [filters.SearchFilter]
    filterset_fields = ["trainer"]
    search_fields = [
        "name",
        "trainer__username",
        "trainer__first_name",
        "trainer__last_name",
    ]

    # ✅ FIX TRÙNG PHÒNG + TRÙNG LỊCH NGAY KHI TẠO CLASS
    def perform_create(self, serializer):
        instance = serializer.save()

        room = instance.room
        schedules = Schedule.objects.filter(yoga_class__room=room)

        for s in schedules:
            if is_overlap(instance.start_date, instance.end_date, instance.start_date, instance.end_date):
                pass  # class-level không đủ dữ liệu time nên check ở schedule là chính


class TrainerClassView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.GET.get("search", "")

        classes = Class.objects.filter(trainer=request.user)

        if search:
            classes = classes.filter(name__icontains=search)

        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)


class TrainerStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "trainer":
            return Response({"error": "Không có quyền"}, status=403)

        enrollments = Enrollment.objects.filter(
            yoga_class__trainer=user,
            status="approved"
        ).select_related("user", "yoga_class")

        data = [
            {
                "id": e.id,
                "student_name": e.user.username,
                "student_email": e.user.email,
                "class_name": e.yoga_class.name,
                "status": e.status,
                "created_at": e.created_at,
            }
            for e in enrollments
        ]

        return Response(data)


# =========================
# ROOM VIEWSET
# =========================
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]