"""
Local settings for HeatherscratchR2
"""

# Database settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3'
    },
    'slave1': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'slave1.db.sqlite3'
    },
    'slave2': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'slave2.db.sqlite3'
    }
}

# Enable debug mode
DEBUG = True

"""
To automatically enable debug mode on the Django development server:
import sys
if 'runserver' in sys.argv:
    DEBUG = True
else:
    DEBUG = False
"""

# Sets the templates loader's debug mode to the same as the rest of Django
TEMPLATE_DEBUG = DEBUG

"""
Make this unique, and don't share it with anybody.
To generate a new one, open python and run this script:

from django.utils.crypto import get_random_string
chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
secret_key = get_random_string(50, chars)
print(secret_key)

and replace heatherscratch_insecure by the output
"""
SECRET_KEY = 'heatherscratch_insecure'

"""
Local time zone for this installation. Choices can be found here:
http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
although not all choices may be available on all operating systems.
On Unix systems, a value of None will cause Django to use the same
timezone as the operating system.
If running in a Windows environment this must be set to the same as your
system time zone.
"""
TIME_ZONE = None

"""
You can override the HeatherscratchR2 settings here.

For example, to use / as root instead of /scratchr2, you can add this:
ROOT_URL = '/scratchr2'

If you want to override the wiki root and article path, you can:
WIKI_ROOT = 'https://en.scratch-wiki.info'
WIKI_URL = WIKI_ROOT + '/wiki'
"""
