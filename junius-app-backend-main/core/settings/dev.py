from .base import *
import os

DEBUG_APPS = ["debug_toolbar"]
DEBUG = True

INSTALLED_APPS = DEBUG_APPS + BASE_APPS


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    "SHOW_COLLAPSED": True,
    "RESULTS_CACHE_SIZE": 100,
    "RENDER_PANELS": True,
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
    "SQL_WARNING_THRESHOLD ": 100,  # milliseconds
}


INTERNAL_IPS = [
    "127.0.0.1",
]

THIRD_PARTY_MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware",]


MIDDLEWARE += THIRD_PARTY_MIDDLEWARE

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        "ATOMIC_REQUESTS": True,
    }
}

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": config("DATABASE"),
#         "USER": config("SQL_USER"),
#         "PASSWORD": config("SQL_PASSWORD"),
#         "HOST": config("SQL_HOST"),
#         "PORT": config("SQL_PORT"),
#     }
# }
