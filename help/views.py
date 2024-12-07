from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import loader, Context
from django.http import Http404
from django.template import TemplateDoesNotExist

# Create your views here.
def tips(request, tip):
	if tip[-1] == '/':
		tip = tip[:-1]
	try :
		return render(request, 'help/tips/' + tip + '.html')
	except TemplateDoesNotExist:
           raise Http404("Tip does not exist")