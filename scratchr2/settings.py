#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
HeatherscratchR2 global settings
If you want to change those, override them in local_settings.py
unless you want to contribute them to the public repo
"""

import os

# Required to load DjangoBB
import sys
sys.path.append('../djangobb_forum')

# DjangoBB settings
from djangobb_forum.scratchr2_settings import *

# Django replicated settings
from django_replicated.settings import *


# Required for languages
DEFAULT_CHARSET = 'utf-8'
reload(sys)
sys.setdefaultencoding('UTF8')

# Django

# Set the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

# The never ending list of languages
LANGUAGES = (
    ('en',      'English '), # The space is required else the name will get translated
    ('an',      'Aragonés'),
    ('ast',     'Asturianu'),
    ('id',      'Bahase Indonesia'),
    ('ms',      'Bahasa Melayu'),
    ('ca',      'Català'),
    ('cs',      'Česky'),
    ('cy',      'Cymraeg'),
    ('da',      'Dansk'),
    ('fa-af',   'Dari'),
    ('de',      'Deutsch'),
    ('et',      'Eesti'),
    ('eo',      'Esperanto'),
    ('es',      'Español'),
    ('eu',      'Euskera'),
    ('fr',      'Français'),
    ('fr-ca',   'Français (Canada)'),
    ('ga',      'Gaeilge'),
    ('gl',      'Galego'),
    ('hr',      'Hrvatski'),
    ('is',      'Íslenska'),
    ('it',      'Italiano'),
    ('rw',      'Kinyarwanda'),
    ('ku',      'Kurdî'),
    ('la',      'Latina'),
    ('lv',      'Latviešu'),
    ('lt',      'Lietuvių'),
    ('hu',      'Magyar'),
    ('mt',      'Malti'),
    ('cat',     'Meow'),
    ('nl',      'Nederlands'),
    ('nb',      'Norsk Bokmål'),
    ('pl',      'Polski'),
    ('pt',      'Português'),
    ('pt-br',   'Português Brasileiro'),
    ('ro',      'Română'),
    ('sc',      'Sardu'),
    ('sk',      'Slovenčina'),
    ('sl',      'Slovenščina'),
    ('fi',      'suomi'),
    ('sv',      'Svenska'),
    ('nai',     'Tepehuan'),
    ('vi',      'Tiếng Việt'),
    ('tr',      'Türkçe'),
    ('ar',      'العربية'),
    ('bg',      'Български'),
    ('el',      'Ελληνικά'),
    ('fa',      'فارسی'),
    ('he',      'עִבְרִית'),
    ('hi',      'हिन्दी'),
    ('hy',      'Հայերեն'),
    ('ja',      '日本語'),
    ('ja-hr',   'にほんご'),
    ('km',      'សំលៀកបំពាក'),
    ('kn',      'ಭಾಷೆ-ಹೆಸರು'),
    ('ko',      '한국어'),
    ('mk',      'Македонски'),
    ('ml',      'മലയാളം'),
    ('mn',      'Монгол хэл'),
    ('mr',      'मराठी'),
    ('my',      'မြန်မာဘာသာ'),
    ('ru',      'Русский'),
    ('sr',      'Српски'),
    ('th',      'ไทย'),
    ('uk',      'Українська'),
    ('zh-cn',   '简体中文'),
    ('zh-tw',   '正體中文')
)

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

"""
Absolute filesystem path to the directory that will hold user-uploaded files.
Example: "/home/media/media.lawrence.com/media/"
"""
MEDIA_ROOT = ''

"""
URL that handles the media served from MEDIA_ROOT. Make sure to use a
trailing slash.
Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
"""
MEDIA_URL = ''

"""
Absolute path to the directory static files should be collected to.
Don't put anything in this directory yourself; store your static files
in apps' "static/" subdirectories and in STATICFILES_DIRS.
Example: "/home/media/scratch.mit.edu/static/"
"""
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://scratch.mit.edu/scratchr2/static/"
STATIC_URL = '/scratchr2/static'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(os.path.dirname(BASE_DIR), "static"),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    # Django
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # 3rd party
    'pagination.middleware.PaginationMiddleware',

    # HeatherscratchR2
    'djangobb_forum.middleware.LastLoginMiddleware',
    'djangobb_forum.middleware.UsersOnline',
)

ROOT_URLCONF = 'scratchr2.urls'

# Python dotted path to the WSGI application used by Django's dev server.
WSGI_APPLICATION = 'scratchr2.wsgi.application'

# Template path
TEMPLATE_DIRS = (
    os.path.join(os.path.dirname(BASE_DIR), "templates")
)

TEMPLATE_CONTEXT_PROCESSORS = (
    # Django
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',

    # HeatherscratchR2
    'djangobb_forum.context_processors.forum_settings',
    'scratchr2.context_processors.settings',
)

INSTALLED_APPS = (
    # Django
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.humanize',

    # 3rd party
    'pagination',
    'haystack',

    # HeatherscratchR2 apps
    'djangobb_forum',
    'base_comments',
    'accounts',
    'userprofiles',
    'notifications',
    'siteapi',
    'projects',
    'info',
    'mystuff',
    'news',
)

# Required for ScratchR2's javascript code
CSRF_COOKIE_NAME = 'scratchcsrftoken'

"""
A sample logging configuration. The only tangible logging
performed by this configuration is to send an email to
the site admins on every HTTP 500 error when DEBUG=False.
See http://docs.djangoproject.com/en/dev/topics/logging for
more details on how to customize your logging configuration.
"""
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

# Cache settings
CACHE_MIDDLEWARE_ANONYMOUS_ONLY = True

# Django replicated settings
REPLICATED_DATABASE_SLAVES = ['slave1', 'slave2']
DATABASE_ROUTERS = ['django_replicated.router.ReplicationRouter']
REPLICATED_DATABASE_DOWNTIME = 20

# Haystack settings
# TODO: Install Solr
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
    },
}

"""
For Solr:

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.solr_backend.SolrEngine',
        'URL': 'http://localhost:8983/solr/default',
        'TIMEOUT': 60 * 5,
        'INCLUDE_SPELLING': True,
        'BATCH_SIZE': 100,
        'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
    },
}
"""

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

# Allauth settings
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_EMAIL_REQUIRED = True

# ScratchR2 settings
ROOT_URL = '/scratchr2'
WIKI_ROOT = ROOT_URL
WIKI_URL = WIKI_ROOT + '/wiki'

# Local settings must come last to overwrite any other settings
FORGOT_SETTINGS = 0
try:
    from local_settings import *
except ImportError:
    try:
        # Did not upgrade from database.py to local_settings.py
        from database import *
        FORGOT_SETTINGS = 1
    except ImportError:
        # Did not set up local settings
        FORGOT_SETTINGS = 2
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': 'db.sqlite3'
            }
        }
