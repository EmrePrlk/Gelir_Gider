from django.urls import path
from .views import (
    UserDetailView,
    UserDetaiAlllView,
    CustomTokenObtainPairView,
    RegisterView,
    UserCertificateCrudView,
    UserLanguageCrudView,
    UserEducationCrudView,
    UserExperienceCrudView,
    GroupCrudView,  # rolegroups
    UserNotesForHRCrudView,
    UserDetailMeView
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.SimpleRouter()

router.register('usercertificate', UserCertificateCrudView)
router.register('userlanguage', UserLanguageCrudView)
router.register('usereducation', UserEducationCrudView)
router.register('userexperience', UserExperienceCrudView)
router.register('user', UserDetailView)
router.register('rolegroups', GroupCrudView)
router.register('usernotes', UserNotesForHRCrudView)


urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('alluser/', UserDetaiAlllView.as_view(), name='alluser'),
    path('me/', UserDetailMeView.as_view(), name='me'),
]

urlpatterns += router.urls
