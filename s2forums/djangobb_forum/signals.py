from django.db.models.signals import post_save
from django.utils import timezone

from djangobb_forum.subscription import notify_topic_subscribers
from djangobb_forum.models import Topic, Post


def post_saved(instance, **kwargs):
    created = kwargs.get('created')
    post = instance
    topic = post.topic

    if created:
        topic.last_post = post
        topic.post_count = topic.posts.count()
        topic.updated = timezone.now()
        profile = post.user.forum_profile
        profile.post_count = post.user.posts.count()
        profile.save(force_update=True)
    topic.save(force_update=True)
    if created:
		notify_topic_subscribers(post)


def topic_saved(instance, **kwargs):
    topic = instance
    forum = topic.forum
    forum.topic_count = forum.topics.count()
    forum.updated = topic.updated
    forum.post_count = forum.posts.count()
    forum.last_post_id = topic.last_post_id
    forum.save(force_update=True)
