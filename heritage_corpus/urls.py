#  -- coding: utf8 --

from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from annotator.admin import learner_admin
from Corpus.views import Index, Search, Statistics, PopUp, download_file, DownloadSearch
from news.views import NewsView, SectionView


urlpatterns = patterns('',
    url(r'^$', SectionView.as_view(), name='start_page'),

    url(r'^admin/', include(learner_admin.urls)),

    url(r'^download_file/(?P<doc_id>[\w\-]+)/(?P<doc_type>ann|tokens|text)$', download_file, name='download_file'),

    url(r'^document-annotations', include('annotator.urls', namespace='annotations')),

    url(r'^(help|rulec|conference)$', Index.as_view(), name='main.static'),

    url(r'^news$', NewsView.as_view(), name='news'),

    url(r'^search/$', Search.as_view(), name='main.search'),
    url(r'^search/download/$', DownloadSearch.as_view(), name='main.search.download'),
    url(r'^search/(gramsel|lex|errsel)$', PopUp.as_view(), name='popup'),

    url(r'^stats/$', Statistics.as_view(), name='main.stats'),

    (r'^i18n/', include('django.conf.urls.i18n')),
    )

urlpatterns += staticfiles_urlpatterns()