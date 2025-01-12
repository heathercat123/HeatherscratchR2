from django.conf.urls import url
from . import views


userregex = '[a-z|0-9|-|_]+'
urlpatterns = [
    url(r'^(?P<username>' + userregex + ')/$', views.userprofile, name="userprofile"),
    url(r'^' + userregex + '/scratcher-promotion/$', views.scratcher_promotion_modal, name="scratcher_promotion_modal"),
]
