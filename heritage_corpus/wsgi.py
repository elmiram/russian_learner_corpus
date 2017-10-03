"""
WSGI config for heritage_corpus project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "heritage_corpus.settings")

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

application = get_wsgi_application()
