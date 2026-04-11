from rest_framework import serializers
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
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JwtTokenObtainPairSerializer


class IdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idea
        fields = ['id', 'title', 'summary', 'detail', 'document_link',
                  'status', 'user_id', 'entry_date', 'category', 'possible_competitor', 'target_investment']


class IdeaProcessLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdeaProcessLog
        fields = ['id', 'idea_id', 'log_date', 'description',
                  'document_link', 'thought_for_process']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'summary', 'detail', 'status',
                  'idea_id', 'estimated_complete_date', 'entry_date', 'category']


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = ['id', 'project_id', 'title', 'description', 'document_link']


class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStatus
        fields = ['id', 'user_id', 'project_id', 'total_task_count',
                  'total_done_task_count', 'percentage']


class ProjectStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStaff
        fields = ['id', 'project_id', 'user_id', 'staff_role_id']


class ProjectInvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInvestment
        fields = ['id', 'project_id', 'user_id', 'target_investment_date',
                  'target_investment_amount', 'actual_investment_date', 'actual_investment_amount']


class InterestedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestedProject
        fields = ['id', 'project_id', 'user_id']


class ProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLink
        fields = ['id', 'project_id', 'link_type', 'link_address']
