from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'^comments/user/(?P<username>.+)/$', views.usercomments, name="usercomments"),
	url(r'^comments/with-deleted/user/(?P<username>.+)/$', views.usercomments, name="usercomments"),
]