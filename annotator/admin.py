#  -- coding: utf8 --

""" Admin panel settings. """

from annotator.models import Document, Morphology
from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.utils.translation import ugettext_lazy as _
from news.models import Article, Section


class OwnerFilter(admin.SimpleListFilter):
    title = _("owner")
    parameter_name = 'owner'

    def lookups(self, request, model_admin):
        users = list(set([doc.owner for doc in Document.objects.all()]))
        res = []
        for u in users:
            if u is None:
                continue
            if u.first_name:
                res.append((u.username, u.first_name + ' ' + u.last_name))
            else:
                res.append((u.username, u.username))
        return res

    def queryset(self, request, queryset):
        if self.value() is None:
            return Document.objects.all()
        return queryset.filter(owner__username=self.value())


class LearnerCorpusAdminSite(AdminSite):
    site_header = 'Russian Learner Corpus'
    site_title = 'Admin'
    index_title = 'RLC'


# отображение новостных статей
class ArticleAdmin(admin.ModelAdmin):
    fields = ['date', 'text_eng', 'text_rus']  # в панели редактирования
    list_display = ('date', 'text_eng', 'text_rus', 'created')  # в таблице


class StarredAdmin(admin.ModelAdmin):
    fields = ['user', 'sentences']  # в панели редактирования
    list_display = ('user', 'sentences')  # в таблице


# отображение секций стартовой страницы
class SectionAdmin(admin.ModelAdmin):
    fields = ['number', 'header_eng', 'text_eng', 'header_rus', 'text_rus']  # в панели редактирования
    list_display = ('number', 'header_eng', 'text_eng', 'header_rus', 'text_rus')  # в таблице


# отображение информации о текстах корпуса
class DocumentAdmin(admin.ModelAdmin):
    fieldsets = [  # в панели редактирования
        (None,               {'fields': ['owner', 'title', 'body', 'filename']}),
        ('Author', {'fields':
                        [
                            ('author', 'gender', 'course'),
                            ('language_background', 'native'),
                            ('general_level', 'level'),
                            ('fullmeta')
                        ]
                    }
        ),
        ('Date', {'fields': [('date1')]}),
        ('Text', {'fields': [('genre','time_limit', 'mode', 'subcorpus')]}),
        ('Autocompletion', {'fields': [('annotated', 'checked')], 'classes': [('collapse')]}),
    ]

    list_display = ('id', 'title', 'owner', 'subcorpus', 'author', 'gender', 'native',
                    'language_background', 'level', 'mode', 'created', 'annotated',
                    'checked', 'fullmeta')  # в таблице
    list_filter = ['fullmeta', OwnerFilter, 'gender', 'annotated', 'checked', 'level',
                   'subcorpus', 'native', 'language_background', 'course', 'genre']
    # фильтры справа в панели редактирования


class AnnotationAdmin(admin.ModelAdmin):
    readonly_fields = ('annotated_doc',)
    list_display = ('annotated_doc', 'tag', 'owner', 'updated', 'created')

    def annotated_doc(self, instance):
        return instance.document.doc_id.title


class MorphAdmin(admin.ModelAdmin):
    list_display = ('token', 'lem', 'lex', 'gram')


class MorphInline(admin.TabularInline):
    model = Morphology
    extra = 0


class TokenAdmin(admin.ModelAdmin):
    readonly_fields = ('sent_num',)
    fieldsets = [
        (None,               {'fields': ['token', 'doc', 'sent']}),
        ('Token data', {'fields': [('num', 'punctl', 'punctr', 'sent_pos')]}),
    ]

    list_display = ('token', 'sent_num', 'num', 'doc')
    inlines = [MorphInline]

    def sent_num(self, instance):
        return instance.sent.num


learner_admin = LearnerCorpusAdminSite(name='admin')
learner_admin.register(Document, DocumentAdmin)
learner_admin.register(Article, ArticleAdmin)
learner_admin.register(Section, SectionAdmin)
learner_admin.register(User, UserAdmin)
learner_admin.register(Group, GroupAdmin)
