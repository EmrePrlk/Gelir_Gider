from django.urls import path
from .views import (
    IdeaCrudView,
    IdeaProcessLogCrudView,
    ProjectCrudView,
    ProjectDocumentCrudView,
    ProjectStatusCrudView,
    ProjectStaffCrudView,
    ProjectInvestmentCrudView,
    InterestedProjectCrudView,
    ProjectLinkCrudView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.SimpleRouter()

router.register('idea', IdeaCrudView)
router.register('ideaprocesslog', IdeaProcessLogCrudView)
router.register('project', ProjectCrudView)
router.register('projectdocument', ProjectDocumentCrudView)
router.register('projectstatus', ProjectStatusCrudView)
router.register('projectstaff', ProjectStaffCrudView)
router.register('projectinvestment', ProjectInvestmentCrudView)
router.register('interestedproject', InterestedProjectCrudView)
router.register('projectlink', ProjectLinkCrudView)

urlpatterns = [

]

urlpatterns += router.urls
