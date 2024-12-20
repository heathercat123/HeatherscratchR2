from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'^(?P<username>.+)/$', views.detail, name="userprofile"),
]