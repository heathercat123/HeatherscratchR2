from django.http import HttpResponse
from django.shortcuts import render

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils import simplejson as json


def error404(request, exception):
    return render(request, "404.html")


def error500(request, exception):
    return render(request, "500.html")


def homepage(request):
    """
    Render the home page with rows
    """
    context = {
        'projcount': 'PLACEHOLDER'
    }

    """
    Projects test data based on https://scratch.mit.edu/site-api/projects/shared/
    Studios test data based on https://scratch.mit.edu/site-api/galleries/
    """

    """
    Test data uses the javascript-style true/false whereas we need the
    python-style True/False. When projects will be stored in the database,
    Django will automatically fix this for us.
    """
    false = False
    true = True
    context["featuredprojects"] = [
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 1", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 1},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 2", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 2},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 3", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 3},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 4", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 4},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 5", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 5},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 6", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 6},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 7", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 7},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 8", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 8},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 9", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 9},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 10", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 10},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 11", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 11},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 12", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 12},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 13", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 13},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 14", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 14},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 15", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 15},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 16", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 16},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 17", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 17},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 18", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 18},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 19", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 19},
        {"fields": {"view_count": 0, "favorite_count": 0, "remixers_count": 0, "creator": {"username": "test", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}, "title": "Project 20", "isPublished": true, "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/projects/thumbnails/default.png", "visibility": "visible", "love_count": 0, "datetime_modified": "2001-09-11T10:03:00", "uncached_thumbnail_url": "//cdn2.scratch.mit.edu/get_image/project/default_100x80.png", "thumbnail": "default.png", "datetime_shared": "2001-09-11T10:03:00", "commenters_count": 0}, "model": "projects.project", "pk": 20},
    ]
    context["featuredgalleries"] = [
        {"fields": {"curators_count": 0, "projecters_count": 0, "title": "Gallery 1", "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/get_image/gallery/default_170x100.png", "commenters_count": 0, "datetime_modified": "2001-09-11T10:03:00", "owner": {"username": "User", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}}, "model": "galleries.gallery", "pk": 1},
        {"fields": {"curators_count": 0, "projecters_count": 0, "title": "Gallery 2", "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/get_image/gallery/default_170x100.png", "commenters_count": 0, "datetime_modified": "2001-09-11T10:03:00", "owner": {"username": "User", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}}, "model": "galleries.gallery", "pk": 2},
        {"fields": {"curators_count": 0, "projecters_count": 0, "title": "Gallery 3", "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/get_image/gallery/default_170x100.png", "commenters_count": 0, "datetime_modified": "2001-09-11T10:03:00", "owner": {"username": "User", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}}, "model": "galleries.gallery", "pk": 3},
        {"fields": {"curators_count": 0, "projecters_count": 0, "title": "Gallery 4", "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/get_image/gallery/default_170x100.png", "commenters_count": 0, "datetime_modified": "2001-09-11T10:03:00", "owner": {"username": "User", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}}, "model": "galleries.gallery", "pk": 4},
        {"fields": {"curators_count": 0, "projecters_count": 0, "title": "Gallery 5", "datetime_created": "2001-09-11T10:03:00", "thumbnail_url": "//uploads.scratch.mit.edu/get_image/gallery/default_170x100.png", "commenters_count": 0, "datetime_modified": "2001-09-11T10:03:00", "owner": {"username": "User", "pk": 1, "thumbnail_url": "//uploads.scratch.mit.edu/users/avatars/default.png", "admin": false}}, "model": "galleries.gallery", "pk": 5},
    ]
    context["curated"] = context["featuredprojects"]
    context["sds"] = context["featuredprojects"]
    context["remixes"] = context["featuredprojects"]
    context["loves"] = context["featuredprojects"]
    return render(request, "homepage/index.html", context)


def forgot_settings_1(request):
    """
    Render the page for when the user did not upgrade from database.py to LocalSettings.py
    """
    return render(request, "heather/forgot_settings_1.html")


def forgot_settings_2(request):
    """
    Render the page for when the user did not set up any local settings
    """
    return render(request, "heather/forgot_settings_2.html")


@ensure_csrf_cookie
def csrf(request):
    """
    Set the CSRF cookie
    """
    return HttpResponse()


def session(request):
    """
    Get the session used by scratch-www
    """
    response = HttpResponse(json.dumps({}, indent=3))
    return response
