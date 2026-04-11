from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    UserCertificate,
    UserLanguage,
    UserEducation,
    UserExperience,
    UserNotesForHR,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JwtTokenObtainPairSerializer
from definitions.serializers import TitleSerializer
from django.contrib.auth.models import Group, Permission

User = get_user_model()


class CustomTokenObtainPairSerializer(JwtTokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['status'] = user.status
        return token


class UserSerializer(serializers.ModelSerializer):
    title = TitleSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'phone_number', 'type_of_user',
            'title', 'title_experience', 'prefered_title', 'prefered_title_experience',
            'education_level', 'title_project', 'description_project', 'competitors_project', 'documents_project', 'interested_areas',
            'about_me', 'cv_link', 'status', 'profile_picture', 'is_public_profile', 'country',
            'state_region', 'city', 'address', 'zip_code', 'company', 'investment_amount',
            'sector', 'region', 'connection', 'facebook_link', 'instagram_link', 'linkedin_link', 'twitter_link', 'github_link'
        )

    def update(self, instance, validated_data):
        group = validated_data.get('type_of_user')
        group_id2 = Group.objects.filter(
            name=group).values_list('id', flat=True)
        instance.groups.set(group_id2)
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'phone_number', 'type_of_user',
            'title', 'title_experience', 'prefered_title', 'prefered_title_experience',
            'education_level', 'title_project', 'description_project', 'competitors_project', 'documents_project', 'interested_areas',
            'about_me', 'cv_link', 'status', 'profile_picture', 'is_public_profile', 'password', 'password_confirmation', 'country',
            'state_region', 'city', 'address', 'zip_code', 'company', 'investment_amount',
            'sector', 'region', 'connection', 'facebook_link', 'instagram_link', 'linkedin_link', 'twitter_link', 'github_link'
        )

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        profile_picture = validated_data.pop('profile_picture', None)
        cv_link = validated_data.pop('cv_link', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if profile_picture:
            instance.profile_picture = profile_picture
        if cv_link:
            instance.cv_link = cv_link

        instance.save()
        return instance


class UserCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCertificate
        fields = ['id', 'user_id', 'name',
                  'detail', 'hours', 'expiration_date']


class UserLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLanguage
        fields = ['id', 'user_id', 'language_id', 'level']


class UserEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEducation
        fields = ['id', 'user_id', 'school_name',
                  'department', 'graduation_date']


class UserExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExperience
        fields = ['id', 'user_id', 'company_name',
                  'start_date', 'end_date', 'title_id', 'description']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']


class UserNotesForHRSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotesForHR
        fields = ['id', 'user_id', 'note_owner_user_id',
                  'note_date', 'note_detail']
