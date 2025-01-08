from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson as json

# Create your views here.
def account_nav(request):
	"""
	TODO: Make this dump userprofiles.userprofile like in ScratchR2
	"""
	response = HttpResponse(json.dumps({ }, indent=3))
	return response