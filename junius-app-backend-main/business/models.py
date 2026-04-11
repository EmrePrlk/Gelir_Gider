from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
# from accounts.models import CustomUser
# from definitions.models import (
#                                 Title,
#                                )

# Create your models here.


class Idea(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField()
    detail = models.TextField()
    document_link = models.FileField(blank=True, null=True)
    status = models.CharField(max_length=50)
    entry_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    category = models.CharField(max_length=50, null=True, blank=True)
    possible_competitor = models.TextField(blank=True, null=True)
    target_investment = models.IntegerField(blank=True, null=True)
    user_id = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title


class IdeaProcessLog(models.Model):
    idea_id = models.IntegerField()
    log_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    document_link = models.FileField(blank=True, null=True)
    thought_for_process = models.TextField()

    def __str__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField()
    detail = models.TextField()
    status = models.CharField(max_length=50)
    idea_id = models.ForeignKey(
        Idea, on_delete=models.CASCADE, null=True, blank=True)
    estimated_complete_date = models.DateTimeField(
        auto_now_add=True, null=True, blank=True)
    entry_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    category = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.title


class ProjectDocument(models.Model):
    project_id = models.ForeignKey(
        Project, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    document_link = models.FileField()

    def __str__(self):
        return self.title


class ProjectStatus(models.Model):
    # models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.IntegerField()
    project_id = models.ForeignKey(
        Project, on_delete=models.CASCADE, null=True, blank=True)
    total_task_count = models.IntegerField()
    total_done_task_count = models.IntegerField()
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        editable=False
    )

    def save(self, *args, **kwargs):
        if self.total_task_count > 0:
            self.percentage = (self.total_done_task_count /
                               self.total_task_count) * 100
        else:
            self.percentage = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user_id}"


class ProjectStaff(models.Model):
    # ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    project_id = models.IntegerField()
    # models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.IntegerField()
    # models.ForeignKey(Title, on_delete=models.SET_NULL, null=True, blank=True)
    staff_role_id = models.ForeignKey(
        'definitions.Title', on_delete=models.CASCADE, null=True, blank=True, default=1)

    def __str__(self):
        return f"{self.user_id}"


class ProjectInvestment(models.Model):
    # ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    project_id = models.IntegerField()
    # user_id = models.IntegerField()#models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.CASCADE, null=True, blank=True)
    target_investment_date = models.DateField(
        auto_now_add=True, null=True, blank=True)
    target_investment_amount = models.IntegerField()
    actual_investment_date = models.DateField(
        auto_now_add=True, null=True, blank=True)
    actual_investment_amount = models.IntegerField()

    def __str__(self):
        return f"{self.user_id}"


class InterestedProject(models.Model):
    # ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    project_id = models.IntegerField()
    # user_id = models.IntegerField()#models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user_id}"


class ProjectLink(models.Model):

    TYPE_CHOICES = [
        (1, 'Web Site'),
        (2, 'Junius Flow'),
        (3, 'Discord'),
        (4, 'Github'),
        (5, 'Instagram'),
        (6, 'Linkedin'),
        (7, 'X'),
        (8, 'Facebook'),
    ]
    # ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    project_id = models.ForeignKey(
        Project, on_delete=models.CASCADE, null=True, blank=True)
    link_type = models.IntegerField(choices=TYPE_CHOICES)
    link_address = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.project_id}"
