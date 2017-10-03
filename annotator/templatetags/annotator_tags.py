#  -- coding: utf8 --

""" Template tags for annotator app."""

from django import template
from django.contrib.auth.models import Group

register = template.Library()


@register.filter(name='has_group')
def has_group(user, group_name):
    """Returns True if the given user is a member of the given group."""
    group = Group.objects.get(name=group_name)
    return True if group in user.groups.all() else False
