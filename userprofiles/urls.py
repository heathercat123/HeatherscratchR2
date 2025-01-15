from django.conf.urls import url
from . import views


userregex = '[a-z|A-Z|0-9|-|_]+'
urlpatterns = [
    url(r'^(?P<username>' + userregex + ')/$', views.profile_detail, name="profile_detail"),
    url(r'^' + userregex + '/scratcher-promotion/$', views.scratcher_promotion_modal, name="scratcher_promotion_modal"),
]
