from django.db import models
from business.models import (
                                Project,
                            )

# Create your models here.

class Role(models.Model):
    code = models.IntegerField()
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Title(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Skill(models.Model):
    description = models.CharField(max_length=100)
    title = models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.description


class UserProfileType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class ProjectMapsJuniflow(models.Model):
    ja_project_id = models.IntegerField()
    jf_project_id = models.IntegerField()

    def __str__(self):
        return f"{self.ja_project_id}"

class UserMapsJuniflow(models.Model):
    ja_user_id = models.IntegerField()
    jf_user_id = models.IntegerField()

    def __str__(self):
        return f"{self.ja_user_id}"

class ProjectPartner(models.Model):
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.IntegerField()
    oran = models.IntegerField()

    def __str__(self):
        return f"{self.project_id}"

class UserRole(models.Model):
    user_id = models.IntegerField()
    project_id = models.IntegerField()
    role_id = models.IntegerField()

    def __str__(self):
        return f"{self.user_id}"

class Menu(models.Model):
    project_id = models.IntegerField()
    type_of_menu = models.CharField(max_length=50)#menu-panel
    code = models.CharField(max_length=50)#
    name = models.CharField(max_length=50)
    main_menu_id = models.IntegerField()

    def __str__(self):
        return f"{self.project_id}"

class MenuRole(models.Model):
    role_id = models.IntegerField()
    project_id = models.IntegerField()
    menu_id = models.IntegerField()

    def __str__(self):
        return f"{self.role_id}"

class Language(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
