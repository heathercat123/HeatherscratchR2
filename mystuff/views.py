from django.shortcuts import render


def index(request): # TODO: Get rid of 'PLACEHOLDER' and make tabs work
    return render(request, "mystuff/studio.html",{
        'projects_count': 'PLACEHOLDER',
        'shared_count': 'PLACEHOLDER',
        'notshared_count': 'PLACEHOLDER',
        'gallery_count': 'PLACEHOLDER',
    })
