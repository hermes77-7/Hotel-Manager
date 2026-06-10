import os
from django.core.wsgi import get_wsgi_application

env = os.environ.get('DJANGO_ENV', 'development')
if env == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()