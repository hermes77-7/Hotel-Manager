import os
import sys

def main():
    # Use production settings if DJANGO_ENV is set to production
    # otherwise fall back to development settings
    env = os.environ.get('DJANGO_ENV', 'development')
    if env == 'production':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()