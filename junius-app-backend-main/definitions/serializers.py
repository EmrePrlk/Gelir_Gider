from rest_framework import serializers
from django.contrib.auth import get_user_model
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
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JwtTokenObtainPairSerializer

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'code', 'name']

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ['id', 'name']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'description', 'title']

class UserProfileTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileType
        fields = ['id', 'name']

class ProjectMapsJuniflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMapsJuniflow
        fields = ['id', 'ja_project_id', 'jf_project_id']

class UserMapsJuniflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMapsJuniflow
        fields = ['id', 'ja_user_id', 'jf_user_id']

class ProjectPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectPartner
        fields = ['id', 'project_id', 'user_id', 'oran']

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'user_id', 'project_id', 'role_id']

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'project_id', 'type_of_menu', 'code', 'name', 'main_menu_id']

class MenuRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuRole
        fields = ['id', 'role_id', 'project_id', 'menu_id']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']
