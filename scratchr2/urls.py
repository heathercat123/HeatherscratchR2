from django.conf.urls import url, include
from django.contrib import admin
from django.views.i18n import javascript_catalog

from scratchr2 import settings
from . import views


admin.autodiscover()

urlpatterns = []
if settings.FORGOT_SETTINGS == 1:
    urlpatterns = [url(r'^', views.forgot_settings_1)]

if settings.FORGOT_SETTINGS == 2:
    urlpatterns = [url(r'^', views.forgot_settings_2)]

urlpatterns += [
    url(r'^scratchr2/', include([ # Remove this url block to make every /scratchr2 url be at root
        # Non-ScratchR2
        url(r'^admin/', admin.site.urls),
        url(r'^forgotsettings1/$', views.forgot_settings_1),
        url(r'^forgotsettings2/$', views.forgot_settings_2),

        # Apps
        url(r'^discuss/', include('djangobb_forum.urls', namespace='djangobb')),
        url(r'^projects/', include("projects.urls")),
        url(r'^news/', include("news.urls")),
        url(r'^site-api/', include("siteapi.urls")),

        # Help
        url(r'^help/', include("info.urls")),
        url(r'^info/', include("info.urls")),

        # Users
        url(r'^accounts/', include('accounts.urls')),
        url(r'^users/', include("userprofiles.urls")),
        url(r'^messages/', include("notifications.urls")),
        url(r'^fragment/', include("fragment.urls")),
        url(r'^mystuff/$', include("mystuff.urls")),
        url(r'^session/$', views.session, name="session"),

        # Misc
        url(r'^$', views.homepage, name="home"),
        url(r'^jsi18n/$', javascript_catalog, name='javascript-catalog'),
    ])),
    url(r'^csrf_token/$', views.csrf),
    url(r'^i18n/', include('django.conf.urls.i18n')),
]
