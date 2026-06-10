
import os
from pathlib import Path
from datetime import timedelta

# ── Base ──────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# Read from environment — falls back to dev defaults
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
DEBUG      = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get(
    'ALLOWED_HOSTS', 'localhost,127.0.0.1'
).split(',')

# ── Apps ──────────────────────────────────────────
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
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF       = 'config.urls'
AUTH_USER_MODEL    = 'accounts.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

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

WSGI_APPLICATION = 'config.wsgi.application'

# ── Database ──────────────────────────────────────
DATABASE_URL = os.environ.get('DATABASE_URL', '')

if DATABASE_URL:
    # Production — Render provides DATABASE_URL
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=not DEBUG,
        )
    }
else:
    # Local development — use SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME':   BASE_DIR / 'db.sqlite3',
        }
    }

# ── Static files ──────────────────────────────────
STATIC_URL  = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ── CORS ──────────────────────────────────────────
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:4200'
).split(',')
CORS_ALLOW_CREDENTIALS = True

# ── JWT ───────────────────────────────────────────
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
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# ── Security (only in production) ────────────────
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT     = True
    SESSION_COOKIE_SECURE   = True
    CSRF_COOKIE_SECURE      = True

# ── Spectacular ───────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE':       'Hotel Management System API',
    'DESCRIPTION': 'Aurum Hotel ERP API',
    'VERSION':     '1.0.0',
    'SECURITY':    [{'bearerAuth': []}],
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

# ── Jazzmin ───────────────────────────────────────
JAZZMIN_SETTINGS = {
    # ── Branding ──────────────────────────────────
    "site_title":        "Aurum Admin",
    "site_header":       "Aurum Hotel",
    "site_brand":        "⬡ AURUM",
    "site_logo":         None,
    "welcome_sign":      "Welcome to the Aurum Hotel Management System",
    "copyright":         "Aurum Hotel ERP",

    # ── Top Menu ──────────────────────────────────
    "topmenu_links": [
        {
            "name":  "View Site",
            "url":   "http://localhost:4200",
            "new_window": True
        },
        {
            "name":  "API Docs",
            "url":   "/api/docs/",
            "new_window": True
        },
    ],

    # ── User Menu ─────────────────────────────────
    "usermenu_links": [
        {
            "name":        "API Docs",
            "url":         "/api/docs/",
            "new_window":  True,
            "icon":        "fas fa-book"
        },
    ],

    # ── Sidebar ───────────────────────────────────
    "show_sidebar":            True,
    "navigation_expanded":     True,
    "hide_apps":               [],
    "hide_models":             [],

    # ── Icons ─────────────────────────────────────
    "icons": {
        "auth":                      "fas fa-users-cog",
        "accounts.user":             "fas fa-user-tie",
        "rooms.room":                "fas fa-bed",
        "customers.customer":        "fas fa-user-friends",
        "reservations.booking":      "fas fa-calendar-check",
        "billing.invoice":           "fas fa-file-invoice-dollar",
        "food.menuitem":             "fas fa-utensils",
        "food.foodorder":            "fas fa-concierge-bell",
        "food.orderitem":            "fas fa-list",
        "housekeeping.cleaningtask": "fas fa-broom",
        "housekeeping.hygienereport":"fas fa-clipboard-check",
        "housekeeping.supplylog":    "fas fa-boxes",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",

    # ── UI Tweaks ─────────────────────────────────
    "related_modal_active":       True,
    "custom_js":                  None,
    "use_google_fonts_cdn":       True,
    "show_ui_builder":            False,

    # ── Search ────────────────────────────────────
    "search_model": ["accounts.user", "customers.customer", "rooms.room"],

    # ── Change view ───────────────────────────────
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text":    False,
    "footer_small_text":    False,
    "body_small_text":      False,
    "brand_small_text":     False,
    "brand_colour":         "navbar-dark",
    "accent":               "accent-warning",
    "navbar":               "navbar-dark",
    "no_navbar_border":     True,
    "navbar_fixed":         True,
    "layout_boxed":         False,
    "footer_fixed":         False,
    "sidebar_fixed":        True,
    "sidebar":              "sidebar-dark-warning",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme":                "darkly",
    "default_theme_mode" : 'dark',
    "button_classes": {
        "primary":   "btn-primary",
        "secondary": "btn-secondary",
        "info":      "btn-info",
        "warning":   "btn-warning",
        "danger":    "btn-danger",
        "success":   "btn-success",
    },
}