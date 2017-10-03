#  -- coding: utf8 --

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _


class Article(models.Model):
    """ A class for news articles. """
    owner = models.ForeignKey(User, db_index=True, blank=True, null=True)
    date = models.DateField(help_text=_("Please use the calendar view to choose date."), verbose_name=_('date'))
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    updated = models.DateTimeField(auto_now=True, db_index=True)
    text_rus = models.TextField(help_text=_("Please enter the news text in Russian."),
                                verbose_name=_('text in Russian'))
    text_eng = models.TextField(help_text=_("Please enter the news text in English."),
                                verbose_name=_('text in English'))

    def __unicode__(self):
        return self.text_rus

    class Meta:
        verbose_name = _('article')
        verbose_name_plural = _('articles')


class Section(models.Model):
    """ A class for storing the sections of the main page. """
    text_rus = models.TextField(help_text=_("Please enter the news text in Russian."),
                                verbose_name=_('text in Russian'))
    text_eng = models.TextField(help_text=_("Please enter the news text in English."),
                                verbose_name=_('text in English'))
    header_rus = models.CharField(max_length=100, help_text=_("Enter the name of the section in Russian"),
                                  verbose_name=_('name in Russian'))
    header_eng = models.CharField(max_length=100, help_text=_("Enter the name of the section in English"),
                                  verbose_name=_('name in English'))
    number = models.IntegerField(help_text=_('Please enter the number of the entry on the page'),
                                 verbose_name=_('entry number'))

    class Meta:
        verbose_name = _('section')
        verbose_name_plural = _('sections')

    def save(self, **kwargs):
        """ Saves the section and updates the numbers of all following sections."""
        try:
            p = Section.objects.get(number=self.number)
            # TODO: the renumbering might be done in a much better way
            p.number = self.number + 1
            p.save()
            super(Section, self).save()
        except Section.DoesNotExist:
            super(Section, self).save()

    def __unicode__(self):
        return self.header_rus
