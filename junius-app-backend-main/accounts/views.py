from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from core.permissions import IsOwner
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserCertificateSerializer,
    UserLanguageSerializer,
    UserEducationSerializer,
    UserExperienceSerializer,
    GroupSerializer,
    UserNotesForHRSerializer,
)
from rest_framework import status, viewsets, filters
from rest_framework.permissions import AllowAny
from .models import (
    UserCertificate,
    UserLanguage,
    UserEducation,
    UserExperience,
    UserNotesForHR,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserDetailView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsOwner]
    serializer_class = UserSerializer


class UserDetailMeView(ListAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class UserDetaiAlllView(ListAPIView):  # Returns all users
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )
    ordering_fields = "__all__"
    search_fields = ['email', 'first_name', 'last_name', 'sector']
    filterset_fields = ['type_of_user', 'title', 'status', 'country', 'sector']


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserCertificateCrudView(viewsets.ModelViewSet):
    queryset = UserCertificate.objects.all()
    serializer_class = UserCertificateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )
    ordering_fields = "__all__"
    search_fields = ['name', 'detail']
    filterset_fields = ['user_id', 'name', 'hours']


class UserLanguageCrudView(viewsets.ModelViewSet):
    queryset = UserLanguage.objects.all()
    serializer_class = UserLanguageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        # filters.SearchFilter,
    )
    ordering_fields = "__all__"
    # search_fields = ['language_id']
    filterset_fields = ['user_id', 'language_id', 'level']


class UserEducationCrudView(viewsets.ModelViewSet):
    queryset = UserEducation.objects.all()
    serializer_class = UserEducationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )
    ordering_fields = "__all__"
    search_fields = ['school_name', 'department']
    filterset_fields = ['user_id', 'school_name', 'department']


class UserExperienceCrudView(viewsets.ModelViewSet):
    queryset = UserExperience.objects.all()
    serializer_class = UserExperienceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )
    ordering_fields = "__all__"
    search_fields = ['company_name', 'description']
    filterset_fields = ['user_id', 'title_id']


class GroupCrudView(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]


class UserNotesForHRCrudView(viewsets.ModelViewSet):
    queryset = UserNotesForHR.objects.all()
    serializer_class = UserNotesForHRSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    )
    ordering_fields = "__all__"
    search_fields = ['note_date', 'note_detail']
    filterset_fields = ['user_id', 'note_owner_user_id']
