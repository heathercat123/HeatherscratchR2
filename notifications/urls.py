from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.notifications, name="notifications"),
    url(r'^ajax/user-activity/$', views.user_feed, name="user_feed"),
]
