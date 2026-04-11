from django.shortcuts import render
from .serializers import (
                            RoleSerializer,
                            TitleSerializer,
                            SkillSerializer,
                            UserProfileTypeSerializer,
                            ProjectMapsJuniflowSerializer,
                            UserMapsJuniflowSerializer,
                            ProjectPartnerSerializer,
                            UserRoleSerializer,
                            MenuSerializer,
                            MenuRoleSerializer,
                            LanguageSerializer,
                         )
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from .models import (
                     Role,
                     Title,
                     Skill,
                     UserProfileType,
                     ProjectMapsJuniflow,
                     UserMapsJuniflow,
                     ProjectPartner,
                     UserRole,
                     Menu,
                     MenuRole,
                     Language,
                    )

class RoleCrudView(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    # permission_classes = [IsAuthenticated]

class TitleCrudView(viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = TitleSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class SkillCrudView(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class UserProfileTypeCrudView(viewsets.ModelViewSet):
    queryset = UserProfileType.objects.all()
    serializer_class = UserProfileTypeSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class ProjectMapsJuniflowCrudView(viewsets.ModelViewSet):
    queryset = ProjectMapsJuniflow.objects.all()
    serializer_class = ProjectMapsJuniflowSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class UserMapsJuniflowCrudView(viewsets.ModelViewSet):
    queryset = UserMapsJuniflow.objects.all()
    serializer_class = UserMapsJuniflowSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class ProjectPartnerCrudView(viewsets.ModelViewSet):
    queryset = ProjectPartner.objects.all()
    serializer_class = ProjectPartnerSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class UserRoleCrudView(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class MenuCrudView(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class MenuRoleCrudView(viewsets.ModelViewSet):
    queryset = MenuRole.objects.all()
    serializer_class = MenuRoleSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]

class LanguageCrudView(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    # permission_classes = [IsAuthenticated]#[IsAuthenticated]
