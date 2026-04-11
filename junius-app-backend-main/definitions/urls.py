from django.urls import path
from .views import (
    RoleCrudView,
    TitleCrudView,
    SkillCrudView,
    UserProfileTypeCrudView,
    ProjectMapsJuniflowCrudView,
    UserMapsJuniflowCrudView,
    ProjectPartnerCrudView,
    UserRoleCrudView,
    MenuCrudView,
    MenuRoleCrudView,
    LanguageCrudView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.SimpleRouter()

router.register('role', RoleCrudView)
router.register('title', TitleCrudView)
router.register('skill', SkillCrudView)
router.register('userprofiletype', UserProfileTypeCrudView)
router.register('projectsmap', ProjectMapsJuniflowCrudView)
router.register('usersmap', UserMapsJuniflowCrudView)
router.register('projectpartner', ProjectPartnerCrudView)
router.register('userrole', UserRoleCrudView)
router.register('menudefinition', MenuCrudView)
router.register('menurole', MenuRoleCrudView)
router.register('language', LanguageCrudView)

urlpatterns = [

]

urlpatterns += router.urls
