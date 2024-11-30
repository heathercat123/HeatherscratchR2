from django.shortcuts import render

# Create your views here.
def account_nav(request):
    return render(request, "account-nav.html")