"""
URL configuration for scratchr2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls import handler404, handler500, handler403, handler400
from django.conf.urls.static import static
from django.views.i18n import JavaScriptCatalog
from . import views

urlpatterns = [
	path('scratchr2/', include("scratchr2.scratchr2urls")), # Little hack to make it so every page is under /scratchr2/
	path('site-api/', include("siteapi.urls")),
	path('i18n/', include('django.conf.urls.i18n')),
	path("jsi18n/", JavaScriptCatalog.as_view(), name="javascript-catalog"),
	path("csrf_token/", views.csrf, name="csrftoken"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)