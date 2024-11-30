from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'^(?P<id>\d+)/editor/$', views.editor),
	url(r'editor/$', views.editor, name="editor"),
]