from django.conf.urls import url, include
from . import views

urlpatterns = [
	url(r'account-nav.json', views.account_nav, name="account_nav"),
]