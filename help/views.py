from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import loader

# Create your views here.
def tips(request, tip):
	if tip[-1] == '/':
		tip = tip[:-1]
	tipsTuple = ('help/tips/', tip,'.html')
	template = loader.select_template(["".join(tipsTuple),'404.html'])
	return HttpResponse(template.render(context=None, request=request))