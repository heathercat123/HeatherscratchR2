from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'studio/tips/(?P<tip>.+)$', views.tips, name="tips"),
]