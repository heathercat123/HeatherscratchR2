"""ScratchR2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from djangobb_forum import scratchr2_settings as forum_settings
from django.contrib import admin
from django.views.i18n import javascript_catalog
from . import views
import mystuff
admin.autodiscover()

urlpatterns = [
	url(r'^scratchr2/', include([ # Remove this url block to make every /scratchr2 url be at root
		url(r'^admin/', admin.site.urls),
		url(r'^discuss/', include('djangobb_forum.urls', namespace='djangobb')),
		url(r'^accounts/', include('accounts.urls')),
		url(r'^users/', include("profiles.urls")),
		url(r'^messages/', include("notifications.urls")),
		url(r'^fragment/', include("fragment.urls")),
		url(r'^projects/', include("projects.urls")),
		url(r'^help/', include("help.urls", namespace='help')),
		url(r'^mystuff/$', include("mystuff.urls")),

		url(r'^$', views.homepage, name="home"),
		url(r'^session/$', views.session, name="session"),
		url(r'^jsi18n/$', javascript_catalog, name='javascript-catalog'),
	])),
	url(r'^site-api/', include("siteapi.urls")),
	url(r'^csrf_token/$', views.csrf),
	url(r'^i18n/', include('django.conf.urls.i18n')),
]