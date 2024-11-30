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
    path('admin/', admin.site.urls),
	path('500/', views.error500),
    path('accounts/', include("accounts.urls")),
	path('users/', include("profiles.urls")),
	path('messages/', include("notifications.urls")),
	path('fragment/', include("fragment.urls")),
	path('projects/', include("projects.urls")),
	path('help/', include("help.urls")),
	path('session/', views.session),
	path("", views.homepage, name="homepage"),
]

handler404 = views.error404