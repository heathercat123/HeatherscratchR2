# coding: utf-8


from django.conf import settings as django_settings


def settings(request):
    return {
        'settings': django_settings,
        'DEBUG': django_settings.DEBUG,
    }
