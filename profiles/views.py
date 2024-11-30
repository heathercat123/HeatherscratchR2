from django.shortcuts import render

# Create your views here.
def detail(request):
    return render(request, "profiles/profile_detail.html")