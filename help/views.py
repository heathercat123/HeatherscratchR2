from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import loader, Context

# Create your views here.
def tips(request, tip):
	if tip[-1] == '/':
		tip = tip[:-1]
	return render(request, 'help/tips/' + tip + '.html')