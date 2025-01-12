from django.shortcuts import render


def base(request):
    return render(request, "news/base.html")
