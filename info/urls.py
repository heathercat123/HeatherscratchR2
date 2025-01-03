from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'^$', views.base, name="help"),
	url(r'^scratch-alpha-help/$', views.alpha_help, name="alpha_help"),
	url(r'studio/tips/(?P<tip>.+)$', views.tips, name="tips"),
]