#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import sys
sys.path.append('../djangobb_forum')
from djangobb_forum.scratchr2_settings import *
from django_replicated.settings import *

DEFAULT_CHARSET = 'utf-8'
reload(sys)
sys.setdefaultencoding('UTF8')

# ScratchR2
ROOT_URL = '/scratchr2'
WIKI_ROOT = ROOT_URL
WIKI_URL = WIKI_ROOT + '/wiki'

# Django

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

REPLICATED_DATABASE_SLAVES = ['slave1', 'slave2']
DATABASE_ROUTERS = ['django_replicated.router.ReplicationRouter']
REPLICATED_DATABASE_DOWNTIME = 20

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

LANGUAGES = (
    ('en',		'English '),
	('an',		'Aragonés'),
	('ast',		'Asturianu'),
	('id',		'Bahase Indonesia'),
	('ms',		'Bahasa Melayu'),
	('ca',		'Català'),
	('cs',		'Česky'),
	('cy',		'Cymraeg'),
	('da',		'Dansk'),
	('fa-af',	'Dari'),
	('de',		'Deutsch'),
	('et',		'Eesti'),
	('eo',		'Esperanto'),
	('es',		'Español'),
	('eu',		'Euskera'),
    ('fr',		'Français'),
	('fr-ca',	'Français (Canada)'),
	('ga',		'Gaeilge'),
	('gl',		'Galego'),
	('hr',		'Hrvatski'),
	('is',		'Íslenska'),
	('it',		'Italiano'),
	('rw',		'Kinyarwanda'),
	('ku',		'Kurdî'),
	('la',		'Latina'),
	('lv',		'Latviešu'),
	('lt',		'Lietuvių'),
	('hu',		'Magyar'),
	('mt',		'Malti'),
    ('cat',		'Meow'),
	('nl',		'Nederlands'),
	('nb',		'Norsk Bokmål'),
	('pl',		'Polski'),
	('pt',		'Português'),
	('pt-br',	'Português Brasileiro'),
	('ro',		'Română'),
	('sc',		'Sardu'),
	('sk',		'Slovenčina'),
	('sl',		'Slovenščina'),
	('fi',		'suomi'),
	('sv',		'Svenska'),
	('nai',		'Tepehuan'),
	('vi',		'Tiếng Việt'),
	('tr',		'Türkçe'),
	('ar',		'العربية'),
	('bg',		'Български'),
	('el',		'Ελληνικά'),
	('fa',		'فارسی'),
	('he',		'עִבְרִית'),
	('hi',		'हिन्दी'),
	('hy',		'Հայերեն'),
	('ja',		'日本語'),
	('ja-hr',	'にほんご'),
	('km',		'សំលៀកបំពាក'),
	('kn',		'ಭಾಷೆ-ಹೆಸರು'),
	('ko',		'한국어'),
	('mk',		'Македонски'),
	('ml',		'മലയാളം'),
	('mn',		'Монгол хэл'),
	('mr',		'मराठी'),
	('my',		'မြန်မာဘာသာ'),
	('ru',		'Русский'),
	('sr',		'Српски'),
	('th',		'ไทย'),
	('uk',		'Українська'),
	('zh-cn',	'简体中文'),
	('zh-tw',	'正體中文')
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

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/scratchr2/static'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
	os.path.join(os.path.dirname(BASE_DIR), "static"),
	"C:/Python27/Lib/site-packages/django/contrib/admin/static/admin",
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'b8auw1!%xpnu(tzsy_@nn@dz2jx%3#jo95!f(#s8dsl8d*5klf'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
	'pagination.middleware.PaginationMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
	
    # For DjangoBB
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'pagination.middleware.PaginationMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',

    'djangobb_forum.middleware.LastLoginMiddleware',
    'djangobb_forum.middleware.UsersOnline',
)

ROOT_URLCONF = 'scratchr2.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'scratchr2.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
	os.path.join(os.path.dirname(BASE_DIR), "templates")
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    'djangobb_forum.context_processors.forum_settings',
	'scratchr2.context_processors.settings',
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
	
    'django.contrib.sites', #required by django-allauth
    'django.contrib.sitemaps',
    'django.contrib.admindocs',
    'django.contrib.humanize',

    'pagination',
    'haystack', # For Solr search

    'djangobb_forum',
	'base_comments',
	'accounts',
	'lib',
	'userprofiles',
	'notifications',
	'siteapi',
	'projects',
	'help',
	'mystuff',
	'news',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
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


# Haystack settings
# TODO: Install Solr
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
    },
}

# For Solr:
#
# HAYSTACK_CONNECTIONS = {
#     'default': {
#         'ENGINE': 'haystack.backends.solr_backend.SolrEngine',
#         'URL': 'http://localhost:8983/solr/default',
#         'TIMEOUT': 60 * 5,
#         'INCLUDE_SPELLING': True,
#         'BATCH_SIZE': 100,
#         'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
#     },
# }

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

# Cache settings
CACHE_MIDDLEWARE_ANONYMOUS_ONLY = True

# Allauth
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_SIGNUP_FORM_CLASS = 'bugaga.forms.SignupForm'


# Local settings must come last to overwrite any other settings
FORGOT_SETTINGS = 0
try:
	from local_settings import *
except:
	try:
		from database import *
		FORGOT_SETTINGS = 1
	except:
		FORGOT_SETTINGS = 2
		DATABASES = { 'default': { 'ENGINE': 'django.db.backends.sqlite3', 'NAME': 'db.sqlite3' } }