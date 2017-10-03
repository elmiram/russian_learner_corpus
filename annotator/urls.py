#  -- coding: utf8 --
u"""Управление возможными url с префиксом /document-annotations"""

from django.conf.urls import patterns, url

from annotator.views import Root, Index, Annot, Search, EditorView2, mark, get_correction, handle_upload, star

urlpatterns = patterns('',
                       # storage API
                       url(r'^/$', Root.as_view(), name='annotator.root'),

                       url(r'^/annotations$', Index.as_view(), name='annotator.index'),

                       url(r'^/annotations/([\w\-]+)$', Annot.as_view(), name='annotator.annotation'),

                       url(r'^/search$', Search.as_view(), name='annotation.search'),

                       # update corrections
                       url(r'^/get_correction_by_id/(?P<doc_id>[\w\-]*)', get_correction, name="get.correction"),

                       # mark text as (not) annotated/checked
                       (r'^/document/(?P<doc_id>[\w\-]+)/mark$', mark),

                       # upload annotation from csv
                       (r'^/document/(?P<doc_id>[\w\-]+)/handle_upload$', handle_upload),

                       url(r'^/star/(?P<sent_id>[\w\-]+)/(?P<todo>add|remove)$', star, name="star"),

                       # public pages
                       url(r'^/document/(?P<doc_id>[\w\-]+)/edit$', EditorView2.as_view(), name='annotation.editor'),
                       )

