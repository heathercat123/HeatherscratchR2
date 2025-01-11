from django.conf.urls import url, include
from . import views

# [a-z|0-9|-|_]+ matches any valid Scratch username
urlpatterns = [
	url(r'^(?P<username>[a-z|0-9|-|_]+)/$', views.userprofile, name="userprofile"),
	url(r'^[a-z|0-9|-|_]+/scratcher-promotion/$', views.scratcher_promotion_modal, name="scratcher_promotion_modal"),
]