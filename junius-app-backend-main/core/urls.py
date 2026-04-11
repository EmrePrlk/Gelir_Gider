"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
# urls.py



def trigger_error(request):
    division_by_zero = 1 / 0


# swagger settings
schema_view = get_schema_view(
   openapi.Info(
      title="JuniusApp",
      default_version='v1.0.0',
      description="""
      # Overview

        JuniusApp offers a secure RESTFul API. REST (Representational State Transfer) APIs are one of the most common kinds of web services available today. All request and responses are JSON encoded.The API gives you access to the JuniusApp database so that you can easily fetch and process data to your in-house applications. You can get data in an easy, quick and secure way and seamlessly integrate the requested data or functionality in your applications without any user intervention.

        # Authentication
        For authentication we use  a Token access. The authentication method serves to prove your identity, and it uses security tokens called Token access that grant you access to a certain endpoint. In order to get access to our API, you need to sign up for an account and get your Token for 60 days. You need to send a token in the Authorization header when making a request.

        **Reserved to authenticated users**

        Juniusapp offers one form of authentication (JWT):

        * `Authorization: Bearer <access-token>`

        # Errors

        Our API returns standard HTTP success or error status codes. If any error occurs, we will include additional information about what went wrong in the JSON response. The HTTP status codes that we might return in the http headers of the response are listed below.

        HTTP Status codes:

        | Code      | Title     | Description |
        | ----------| ----------|-------------|
        | 200      | OK       |The request was successful|
        | 400      | Bad request |Bad request|
        | 401      | Unauthorized |Invalid authentication credentials|
        | 404      | Not found	 |The resource does not exist|
        | 429      | Too many requests|The rate limit was exceeded|
        | 500      | Internal server error |An error occurred with our API|

        # Rate limits

        Rate limits act as gatekeepers to control the amount of incoming and outgoing traffic to and from our network. Even as the use of tokens they are part of our overall security. The default rate limit for our API is 60 requests per minute for all endpoints. You may use concurrent connections to reach this. If you need a higher rate limit, contact us for information about our Enterprise plans. Check the returned HTTP headers of any API request to see your current rate limit status.

      """,
        terms_of_service="#",
        # contact=openapi.Contact(email=""),
        license=openapi.License(name="BSD License"),
        hideDownloadButton=False,
        # x_logo={
        #     "url": "https://dev.glowol.com/_next/static/media/glowol-light-logo.0a60d289.png",
        #     "backgroundColor": "#FFFFFF",
        # },
   ),
   public=True,
   permission_classes=[permissions.AllowAny]
)

urlpatterns = (
        [
        path('admin/', admin.site.urls),
        path("__debug__/", include(debug_toolbar.urls)),
        path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
        path("accounts/", include("accounts.urls")),
        path("definitions/", include("definitions.urls")),
        path("business/", include("business.urls")),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
