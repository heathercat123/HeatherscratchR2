# -*- coding: utf-8
import urllib
from datetime import timedelta

from django import template
from django.core.urlresolvers import reverse
from django.core.cache import cache
from django.utils.safestring import mark_safe
from django.utils.encoding import smart_unicode
from django.db import settings
from django.db.models import Q
from django.utils import timezone
from django.utils.text import capfirst
from django.utils.html import escape
from django.utils.hashcompat import md5_constructor
from django.contrib.humanize.templatetags.humanize import naturalday

from django_fsm.db.fields import can_proceed as fsm_can_proceed

from pagination.templatetags.pagination_tags import paginate

from djangobb_forum.models import Report, Post
from djangobb_forum import settings as forum_settings

import logging
logger = logging.getLogger(__name__)

register = template.Library()

# TODO:
# * rename all tags with forum_ prefix

@register.filter
def profile_link(user):
    data = u'<a href="%s">%s</a>' % (\
        reverse('profile_detail', args=[user.username]), user.username)
    return mark_safe(data)


@register.filter
def forum_time(time):
    try:
        return u'%s %s' % (capfirst(naturalday(time)), time.strftime('%H:%M:%S'))
    except AttributeError:
        return u''

@register.filter
def forum_can_view_reports(user):
    return user.is_superuser or user.has_perm('djangobb_forum.change_report')

@register.filter
def forum_reports(user):
    return Report.objects.filter(zapped=False).count()


# TODO: this old code requires refactoring
@register.inclusion_tag('djangobb_forum/pagination.html', takes_context=True)
def pagination(context, adjacent_pages=1):
    """
    Return the list of A tags with links to pages.
    """
    page_range = range(
        max(1, context['page'] - adjacent_pages),
        min(context['pages'], context['page'] + adjacent_pages) + 1)
    previous = None
    next = None

    if not 1 == context['page']:
        previous = context['page'] - 1

    if not 1 in page_range:
        page_range.insert(0, 1)
        if not 2 in page_range:
            page_range.insert(1, '.')

    if not context['pages'] == context['page']:
        next = context['page'] + 1

    if not context['pages'] in page_range:
        if not context['pages'] - 1 in page_range:
            page_range.append('.')
        page_range.append(context['pages'])
    get_params = '&'.join(['%s=%s' % (x[0], x[1]) for x in
        context['request'].GET.iteritems() if (x[0] != 'page' and x[0] != 'per_page')])
    if get_params:
        get_params = '?%s&' % get_params
    else:
        get_params = '?'

    return {
        'get_params': get_params,
        'previous': previous,
        'next': next,
        'page': context['page'],
        'pages': context['pages'],
        'page_range': page_range,
        'results_per_page': context['results_per_page'],
        'is_paginated': context['is_paginated'],
        }


@register.inclusion_tag('djangobb_forum/mobile/pagination.html', takes_context=True)
def mobile_pagination(context):
    get_params = context['request'].GET.copy()
    if 'page' in get_params:
        del get_params['page']
    dict = paginate(context)
    dict['get_params'] = urllib.urlencode(get_params) + '&' if get_params else ''
    return dict

@register.simple_tag
def link(object, anchor=u''):
    """
    Return A tag with link to object.
    """

    url = hasattr(object, 'get_absolute_url') and object.get_absolute_url() or None
    anchor = anchor or smart_unicode(object)
    return mark_safe('<a href="%s">%s</a>' % (url, escape(anchor)))

@register.filter
def mobile_link(object):
    """
    Returns a tag with link to object.
    """

    url = hasattr(object, 'get_mobile_url') and object.get_mobile_url() or None
    return mark_safe('<a href="%s">%s</a>' % (url, escape(smart_unicode(object))))

@register.filter
def has_unreads(topic, user):
    """
    Check if topic has messages which user didn't read.
    """
    if not user.is_authenticated() or\
        (user.posttracking.last_read is not None and\
         user.posttracking.last_read > topic.updated):
            return False
    else:
        if isinstance(user.posttracking.topics, dict):
            if topic.last_post_id > user.posttracking.topics.get(str(topic.id), 0):
                return True
            else:
                return False
        return True

@register.filter
def forum_unreads(forum, user):
    """
    Check if forum has topic which user didn't read.
    """
    if not user.is_authenticated():
        return False
    else:
        if isinstance(user.posttracking.topics, dict):
            topics = forum.topics.only('last_post')
            if user.posttracking.last_read:
                topics = topics.filter(updated__gte=user.posttracking.last_read)
            for topic in topics:
                if topic.last_post_id > user.posttracking.topics.get(str(topic.id), 0):
                    return True
        elif user.posttracking.last_read:
            if forum.topics.filter(updated__gte=user.posttracking.last_read).exists():
                return True
        else:
            return True
        return False


@register.filter
def forum_moderated_by(topic, user):
    """
    Check if user is moderator of topic's forum.
    """

    return user.is_superuser or user in topic.forum.moderators.all()


@register.filter
def forum_editable_by(post, user):
    """
    Check if the post could be edited by the user.
    """

    if user.is_superuser:
        return True
    if not user.has_perm('userprofiles.is_social'):
        return False
    if post.user == user:
        return True
    if user in post.topic.forum.moderators.all():
        return True
    return False


@register.filter
def forum_can_delete(user, post):
    threshold = forum_settings.POST_DELETE_DELAY
    return user.is_superuser or user in post.topic.forum.moderators.all() or (user.has_perm('djangobb_forum.delayed_delete') and timezone.now() - post.created >= timedelta(seconds=threshold))


@register.filter
def forum_posted_by(post, user):
    """
    Check if the post is writed by the user.
    """

    return post.user == user


@register.filter
def forum_equal_to(obj1, obj2):
    """
    Check if objects are equal.
    """

    return obj1 == obj2


@register.filter
def forum_authority(user):
    posts = user.forum_profile.post_count
    if posts >= forum_settings.AUTHORITY_STEP_10:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote10.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_9:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote9.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_8:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote8.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_7:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote7.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_6:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote6.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_5:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote5.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_4:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote4.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_3:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote3.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_2:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote2.gif" alt="" />' % (settings.STATIC_URL))
    elif posts >= forum_settings.AUTHORITY_STEP_1:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote1.gif" alt="" />' % (settings.STATIC_URL))
    else:
        return mark_safe('<img src="%sdjangobb_forum/img/authority/vote0.gif" alt="" />' % (settings.STATIC_URL))


@register.filter
def can_proceed(instance, transition_name):
    """
    Template tag for django-fsm's can_proceed method. Usage:
        {% if instance|can_proceed:"transition_name" %}
        Something
        {% endif %}
    
    Equivalent to:
        if can_proceed(instance.transition_name):
            do_something()
    """
    try:
        transition = getattr(instance, transition_name)
    except AttributeError:
        try:
            logger.warn("Can't process can_proceed. %s has no method %s." % (str(obj), method))
        except:
            # Don't die from logging
            pass
        return False
    return fsm_can_proceed(transition)


@register.filter
def in_group(user, group_name):
    """ Return if a user is in a group called group_name """
    try:
        return user.groups.filter(name=group_name).exists()
    except:
        return False


@register.filter
def online(user):
    return cache.get('djangobb_user%d' % user.id)

@register.filter
def attachment_link(attach):
    from django.template.defaultfilters import filesizeformat
    if attach.content_type in ['image/png', 'image/gif', 'image/jpeg']:
        img = '<img src="%sdjangobb_forum/img/attachment/image.png" alt="attachment" />' % (settings.STATIC_URL)
    elif attach.content_type in ['application/x-tar', 'application/zip']:
        img = '<img src="%sdjangobb_forum/img/attachment/compress.png" alt="attachment" />' % (settings.STATIC_URL)
    elif attach.content_type in ['text/plain']:
        img = '<img src="%sdjangobb_forum/img/attachment/text.png" alt="attachment" />' % (settings.STATIC_URL)
    elif attach.content_type in ['application/msword']:
        img = '<img src="%sdjangobb_forum/img/attachment/doc.png" alt="attachment" />' % (settings.STATIC_URL)
    else:
        img = '<img src="%sdjangobb_forum/img/attachment/unknown.png" alt="attachment" />' % (settings.STATIC_URL)
    attachment = '%s <a href="%s">%s</a> (%s)' % (img, attach.get_absolute_url(), attach.name, filesizeformat(attach.size))
    return mark_safe(attachment)


@register.simple_tag(takes_context=True)
def gravatar(context, email):
    if forum_settings.GRAVATAR_SUPPORT:
        if 'request' in context:
            is_secure = context['request'].is_secure()
        else:
            is_secure = False
        size = max(forum_settings.AVATAR_WIDTH, forum_settings.AVATAR_HEIGHT)
        url = 'https://secure.gravatar.com/avatar/%s?' if is_secure \
            else 'http://www.gravatar.com/avatar/%s?'
        url = url % md5_constructor(email.lower()).hexdigest()
        url += urllib.urlencode({
            'size': size,
            'default': forum_settings.GRAVATAR_DEFAULT,
        })
        return url.replace('&', '&amp;')
    else:
        return ''

@register.simple_tag
def set_theme_style(user):
    theme_style = ''
    selected_theme = ''
    if user.is_authenticated():
        selected_theme = user.forum_profile.theme
        theme_style = '<link rel="stylesheet" type="text/css" href="%(static_url)s/djangobb_forum/themes/%(theme)s/style.css" />'
    else:
        theme_style = '<link rel="stylesheet" type="text/css" href="%(static_url)s/djangobb_forum/themes/default/style.css" />'

    return theme_style % dict(
        static_url=settings.STATIC_URL,
        theme=selected_theme
    )

@register.filter
def dict_lookup(dictionary, key):
    return dictionary.get(key)

