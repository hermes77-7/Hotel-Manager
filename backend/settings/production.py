from decouple import config
import dj_database_url
from datetime import timedelta

SECRET_KEY     = config('SECRET_KEY')
DEBUG          = False
ALLOWED_HOSTS  = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'apps.accounts',
    'apps.rooms',
    'apps.customers',
    'apps.reservations',
    'apps.billing',
    'apps.food',
    'apps.housekeeping',
    'apps.reports',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← serves static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF     = 'config.urls'
AUTH_USER_MODEL  = 'accounts.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Database ──────────────────────────────────────
# Render provides DATABASE_URL automatically
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ── Static files ──────────────────────────────────
import os
BASE_DIR     = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STATIC_URL   = '/static/'
STATIC_ROOT  = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ── CORS ──────────────────────────────────────────
# Will be updated with your Vercel URL after deployment
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    cast=lambda v: [s.strip() for s in v.split(',')]
)
CORS_ALLOW_CREDENTIALS = True

# ── JWT ───────────────────────────────────────────
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES':      ('Bearer',),
}

# ── REST Framework ────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# ── Security ──────────────────────────────────────
SECURE_PROXY_SSL_HEADER    = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT        = True
SESSION_COOKIE_SECURE      = True
CSRF_COOKIE_SECURE         = True

# ── Spectacular ───────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE':       'Hotel Management System API',
    'DESCRIPTION': 'Aurum Hotel ERP API',
    'VERSION':     '1.0.0',
    'SECURITY': [{'bearerAuth': []}],
    'COMPONENTS': {
        'securitySchemes': {
            'bearerAuth': {
                'type':         'http',
                'scheme':       'bearer',
                'bearerFormat': 'JWT',
            }
        }
    },
}

# Jazzmin settings
JAZZMIN_SETTINGS = {
    "site_title":    "Aurum Admin",
    "site_header":   "Aurum Hotel",
    "site_brand":    "⬡ AURUM",
    "welcome_sign":  "Welcome to Aurum Hotel Management",
    "copyright":     "Aurum Hotel ERP",
    "topmenu_links": [
        {"name": "API Docs", "url": "/api/docs/", "new_window": True},
    ],
    "icons": {
        "accounts.user":              "fas fa-user-tie",
        "rooms.room":                 "fas fa-bed",
        "customers.customer":         "fas fa-user-friends",
        "reservations.booking":       "fas fa-calendar-check",
        "billing.invoice":            "fas fa-file-invoice-dollar",
        "food.menuitem":              "fas fa-utensils",
        "food.foodorder":             "fas fa-concierge-bell",
        "housekeeping.cleaningtask":  "fas fa-broom",
        "housekeeping.hygienereport": "fas fa-clipboard-check",
        "housekeeping.supplylog":     "fas fa-boxes",
    },
    "default_icon_parents":  "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active":  True,
}

JAZZMIN_UI_TWEAKS = {
    "theme":           "darkly",
    "default_theme_mode" : 'dark',
    "navbar":          "navbar-dark",
    "sidebar":         "sidebar-dark-warning",
    "accent":          "accent-warning",
    "brand_colour":    "navbar-dark",
    "navbar_fixed":    True,
    "sidebar_fixed":   True,
}