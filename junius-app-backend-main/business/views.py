from django.shortcuts import render
from .serializers import (
    IdeaSerializer,
    IdeaProcessLogSerializer,
    ProjectSerializer,
    ProjectDocumentSerializer,
    ProjectStatusSerializer,
    ProjectStaffSerializer,
    ProjectInvestmentSerializer,
    InterestedProjectSerializer,
    ProjectLinkSerializer,
)
from rest_framework import status, viewsets
from .models import (
    Idea,
    IdeaProcessLog,
    Project,
    ProjectDocument,
    ProjectStatus,
    ProjectStaff,
    ProjectInvestment,
    InterestedProject,
    ProjectLink,
)
from django_filters.rest_framework import DjangoFilterBackend
from .filters import (
    IdeaFilter,
    ProjectFilter,
    ProjectStaffFilter,
    InterestedProjectFilter,
    ProjectInvestmentFilter,
)
# Create your views here.


class IdeaCrudView(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = IdeaFilter


class IdeaProcessLogCrudView(viewsets.ModelViewSet):
    queryset = IdeaProcessLog.objects.all()
    serializer_class = IdeaProcessLogSerializer


class ProjectCrudView(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectFilter


class ProjectDocumentCrudView(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer


class ProjectStatusCrudView(viewsets.ModelViewSet):
    queryset = ProjectStatus.objects.all()
    serializer_class = ProjectStatusSerializer


class ProjectStaffCrudView(viewsets.ModelViewSet):
    queryset = ProjectStaff.objects.all()
    serializer_class = ProjectStaffSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectStaffFilter


class ProjectInvestmentCrudView(viewsets.ModelViewSet):
    queryset = ProjectInvestment.objects.all()
    serializer_class = ProjectInvestmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectInvestmentFilter


class InterestedProjectCrudView(viewsets.ModelViewSet):
    queryset = InterestedProject.objects.all()
    serializer_class = InterestedProjectSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = InterestedProjectFilter


class ProjectLinkCrudView(viewsets.ModelViewSet):
    queryset = ProjectLink.objects.all()
    serializer_class = ProjectLinkSerializer
