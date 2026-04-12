from django_filters import rest_framework as filters
from .models import Idea, Project, ProjectStaff, InterestedProject, ProjectInvestment


class IdeaFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    status = filters.CharFilter(lookup_expr='iexact')
    category = filters.CharFilter(lookup_expr='icontains')
    user_id = filters.NumberFilter()
    entry_date = filters.DateFromToRangeFilter()

    class Meta:
        model = Idea
        fields = ['title', 'status', 'category', 'user_id', 'entry_date']


class ProjectFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    status = filters.CharFilter(lookup_expr='iexact')
    category = filters.CharFilter(lookup_expr='icontains')
    idea_id = filters.NumberFilter()
    entry_date = filters.DateFromToRangeFilter()
    estimated_complete_date = filters.DateFromToRangeFilter()

    class Meta:
        model = Project
        fields = ['title', 'status', 'category', 'idea_id',
                  'entry_date', 'estimated_complete_date']


class ProjectStaffFilter(filters.FilterSet):
    project_id = filters.NumberFilter(field_name='project')
    user_id = filters.NumberFilter(field_name='user')
    staff_role_id = filters.NumberFilter()

    class Meta:
        model = ProjectStaff
        fields = ['project_id', 'user_id', 'staff_role_id']


class InterestedProjectFilter(filters.FilterSet):
    project_id = filters.NumberFilter()
    user_id = filters.NumberFilter()

    class Meta:
        model = InterestedProject
        fields = ['project_id', 'user_id']


class ProjectInvestmentFilter(filters.FilterSet):
    project_id = filters.NumberFilter()
    user_id = filters.NumberFilter()

    class Meta:
        model = ProjectInvestment
        fields = ['project_id', 'user_id']
