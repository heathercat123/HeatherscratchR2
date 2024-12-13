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
DEBUG = True
TEMPLATE_DEBUG = DEBUG