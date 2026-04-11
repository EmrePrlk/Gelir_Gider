from django.contrib import admin
from .models import (
    Idea,
    IdeaProcessLog,
    Project,
    ProjectDocument,
    ProjectStatus,
    ProjectStaff,
    ProjectInvestment,
    InterestedProject,
    ProjectLink
)

# Register your models here.
admin.site.register(Idea)
admin.site.register(IdeaProcessLog)
admin.site.register(Project)
admin.site.register(ProjectDocument)
admin.site.register(ProjectStatus)
admin.site.register(ProjectStaff)
admin.site.register(ProjectInvestment)
admin.site.register(InterestedProject)
admin.site.register(ProjectLink)
