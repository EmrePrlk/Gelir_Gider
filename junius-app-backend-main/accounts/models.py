from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from definitions.models import (
    Title,
    Skill,
    UserProfileType,
    Language,
)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):

    def user_directory_path(instance, filename):
        return "accounts/user/attachment/{0}/{1}".format(instance.email, filename)

    LEVEL_EDUCATION = [
        (1, 'Preschool'),
        (2, 'Primary School'),
        (3, 'Lower Secondary School'),
        (4, 'Upper Secondary School'),
        (5, 'Higher Education'),
    ]

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    phone_number = models.CharField(
        _('phone number'), max_length=15, blank=True)
    type_of_user = models.ForeignKey(
        UserProfileType, on_delete=models.CASCADE, null=True, blank=True)
    title = models.ForeignKey(
        Title, on_delete=models.SET_NULL, null=True, blank=True)
    title_experience = models.CharField(
        _('title_experience'), max_length=30, null=True, blank=True)
    # prefered_title = models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True)
    prefered_title = models.CharField(
        _('prefered_title'), max_length=30, null=True, blank=True)
    prefered_title_experience = models.CharField(
        _('prefered_title_experience'), max_length=30, null=True, blank=True)
    education_level = models.IntegerField(
        choices=LEVEL_EDUCATION, blank=True, null=True)
    title_project = models.CharField(
        _('title_project'), max_length=50, blank=True)
    description_project = models.CharField(
        _('description_project'), max_length=250, blank=True)
    competitors_project = models.CharField(
        _('competitors_project'), max_length=50, blank=True)
    documents_project = models.FileField(
        upload_to=user_directory_path, blank=True, null=True)
    interested_areas = models.CharField(
        _('interested_areas'), max_length=255, blank=True)
    about_me = models.TextField(_('about me'), blank=True, null=True)
    cv_link = models.FileField(
        upload_to=user_directory_path, blank=True, null=True)
    # active deactive rejected pending
    status = models.CharField(
        _('status'), max_length=50, blank=True, default='pending')
    profile_picture = models.ImageField(
        upload_to=user_directory_path, null=True, blank=True)
    is_public_profile = models.CharField(
        _('is_public_profile'), max_length=50, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)
    country = models.CharField(_('country'), max_length=50, blank=True)
    state_region = models.CharField(
        _('state_region'), max_length=50, blank=True)
    city = models.CharField(_('city'), max_length=50, blank=True)
    address = models.CharField(_('address'), max_length=150, blank=True)
    zip_code = models.CharField(_('zip_code'), max_length=50, blank=True)
    company = models.CharField(_('company'), max_length=50, blank=True)
    investment_amount = models.TextField(null=True, blank=True)
    sector = models.CharField(_('sector'), max_length=50, blank=True)
    region = models.CharField(_('region'), max_length=50, blank=True)
    connection = models.CharField(_('connection'), max_length=50, blank=True)
    facebook_link = models.CharField(
        _('facebook_link'), max_length=50, blank=True)
    instagram_link = models.CharField(
        _('instagram_link'), max_length=50, blank=True)
    linkedin_link = models.CharField(
        _('linkedin_link'), max_length=50, blank=True)
    twitter_link = models.CharField(
        _('twitter_link'), max_length=50, blank=True)
    github_link = models.CharField(_('github_link'), max_length=50, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
        # return self.email


class UserCertificate(models.Model):
    user_id = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=50)
    detail = models.TextField()
    hours = models.IntegerField()
    expiration_date = models.DateField()

    def __str__(self):
        return self.name


class UserLanguage(models.Model):

    LEVEL_CHOICES = [
        (1, 'Beginner'),
        (2, 'Elementary'),
        (3, 'Intermediate'),
        (4, 'Upper Intermediate'),
        (5, 'Advanced'),
    ]

    user_id = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    language_id = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.IntegerField(choices=LEVEL_CHOICES)

    def __str__(self):
        return f"{self.level}"


class UserEducation(models.Model):
    user_id = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    school_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    graduation_date = models.DateField()

    def __str__(self):
        return f'{self.user_id.first_name}'


class UserExperience(models.Model):
    user_id = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    company_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    title_id = models.ForeignKey(
        Title, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.user_id.first_name}'


class UserNotesForHR(models.Model):
    user_id = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    note_owner_user_id = models.IntegerField(null=True, blank=True)
    note_date = models.DateField()
    note_detail = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.user_id.first_name}'
