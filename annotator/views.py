#  -- coding: utf8 --

import json
import re
import uuid

from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseServerError, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseForbidden
from django.views.generic import View
from django.views.generic.base import TemplateView
from django.shortcuts import get_object_or_404, render_to_response, redirect
from django.conf import settings
from django.template import *
from django.contrib.auth.models import User

from Corpus.db_utils import Database
from Corpus.search import jquery
from annotator.models import Document, Annotation, Sentence, Starred


def star(request, sent_id, todo):
    sent = Sentence.objects.get(pk=sent_id)
    starred, created = Starred.objects.get_or_create(user=request.user)
    if todo == "add":
        starred.sentences.add(sent)
    else:
        starred.sentences.remove(sent)
    return HttpResponse(json.dumps(list(request.user.starred_set)), content_type="application/json")


def mark(request, doc_id):
    """
    Отмечает текст (не) аннотированным/проверенным.

    :param request: информация о запросе
    :param doc_id: номер текста в базе данных
    :return: HTTPResponse - перенаправляет на страницу, с которой пришел запрос

     Функция меняет запись в ячейках базы данных Document.annotated и Document.checked.
    """
    if not request.user.is_authenticated():
        raise PermissionDenied("You do not have permission to perform this action.")
    doc = Document.objects.get(pk=doc_id)
    page, label = request.POST['next'], request.POST['mark']
    if label == 'checked':
        doc.checked = True
    elif label == 'annotated':
        doc.annotated = True
    if label == 'unchecked':
        doc.checked = False
    elif label == 'unannotated':
        doc.annotated = False
    doc.save()
    return redirect(page)


def get_correction(request, doc_id):
    """
    Получает из базы данных исправленные варианты предложения с заданным id.

    :param request: информация о запросе
    :param doc_id: номер предложения в базе данных
    :return: HTTPResponse - json с двумя строками, который затем передается в javascript
    """
    db = Database()
    req = 'SELECT correct, correct2 FROM annotator_sentence WHERE id=%s' %doc_id
    s = list(db.execute(req)[0])
    return HttpResponse(json.dumps(s), content_type="application/json")


def handle_upload(request, doc_id):
    if not request.user.is_authenticated():
        raise PermissionDenied("You do not have permission to perform this action.")
    page = request.POST['next']
    has_headers = request.POST['has_headers']
    start = 1 if has_headers else 0
    t = [i.strip('\r\n') for i in request.FILES['InputFile'].readlines()]
    for ln in range(start, len(t)):
        sent, word, wordnum, _, _, tag, corr, annotator = t[ln].split('\t')
        sent = int(sent)
        if tag:
            tag1 = [i.strip() for i in tag.split(',')]
            sent = Sentence.objects.get(pk=sent)
            owner = User.objects.get(username=annotator)
            annot = Annotation(owner=owner, document=sent, guid=str(uuid.uuid4()),
                               data=json.dumps({"ranges": [{"start": "/span["+wordnum+"]",
                                                            "end": "/span["+wordnum+"]",
                                                            "startOffset": 0,
                                                            "endOffset": len(word.decode('utf-8'))}],
                                                "quote": word,
                                                "text": "",
                                                "tags": tag1,
                                                "corrs": corr}))
            annot.tag = tag
            annot.start, annot.end = int(wordnum), int(wordnum)
            annot.save()

    a = False
    return redirect(page, alert=a)


class BaseStorageView(View):
    def dispatch(self, request, *args, **kwargs):
        # All PUT/POST requests must contain a JSON body. We decode that here and
        #  interpolate the value into the view argument list.
        if request.method in ('PUT', 'POST'):
            if not re.match("application/json(; charset=UTF-8)?", request.META['CONTENT_TYPE'], re.I):
                return HttpResponseBadRequest("Request must have application/json content type.")

            try:
                body = json.loads(request.body.decode("utf8"))
            except:
                return HttpResponseBadRequest("Request body is not JSON.")

            if not isinstance(body, dict):
                return HttpResponseBadRequest("Request body is not a JSON object.")

            # Interpolate the parsed JSON body into the arg list.
            args = [body] + list(args)

        # All requests return JSON on success, or some other HttpResponse.
        try:
            ret = super(BaseStorageView, self).dispatch(request, *args, **kwargs)

            if isinstance(ret, HttpResponse):
                return ret

            # DELETE requests, when successful, return a 204 NO CONTENT.
            if request.method == 'DELETE':
                return HttpResponse(status=204)

            ret = json.dumps(ret)
            resp = HttpResponse(ret, content_type="application/json")
            resp["Content-Length"] = len(ret)
            return resp
        except ValueError as e:
            return HttpResponseBadRequest(str(e))
        except PermissionDenied as e:
            return HttpResponseForbidden(str(e))
        except ObjectDoesNotExist as e:
            return HttpResponseNotFound(str(e))
        except Exception as e:
            if settings.DEBUG:
                raise  # when debugging, don't trap
            return HttpResponseServerError(str(e))

        return ret


class Root(BaseStorageView):
    http_method_names = ['get']

    def get(self, request):
        if not request.user.is_authenticated():
            raise PermissionDenied("You do not have permission to view this page.")
        if len(request.GET) < 1:
            doc_list = Document.objects.all()
            return render_to_response('annotator/annotate_list.html',
                                      {'docs': doc_list, 'langs':Document.NativeChoices,
                                       'users': User.objects.exclude(
                                           username='admin').exclude(first_name='').order_by('last_name')
                                       },
                                      context_instance=RequestContext(request))
        else:
            if 'user' in request.GET.keys():
                s = [i for i in request.GET.keys() if i != 'user']
                users = [user for user in User.objects.all() if user.username in request.GET.keys()]
                doc_list2 = []
                for user in users:
                    doc_list2 += [ann.document.doc_id for ann in user.annotation_set.all()]
                    doc_list2 = list(set(doc_list2))
                return render_to_response('annotator/annotate_list.html',
                                          {'docs': doc_list2,
                                           'langs':Document.NativeChoices,
                                           'users': User.objects.exclude(
                                               username='admin').exclude(first_name='').order_by('last_name')},
                                          context_instance=RequestContext(request))
            else:
                langs = request.GET.keys()
                doc_list = [doc for doc in Document.objects.all() if doc.native in langs]
                return render_to_response('annotator/annotate_list.html',
                                          {'docs': doc_list,
                                           'langs':Document.NativeChoices,
                                           'users': User.objects.exclude(
                                               username='admin').exclude(first_name='').order_by('last_name')},
                                          context_instance=RequestContext(request))


class Index(BaseStorageView):
    http_method_names = ['get', 'post']

    def get(self, request):
        # index. Returns ALL annotation objects. Seems kind of not scalable.
        return Annotation.as_list()

    def post(self, request, client_data):
        # create. Creates an annotation object and returns a 303.
        obj = Annotation()
        obj.owner = request.user if request.user.is_authenticated() else None
        try:
            obj.document = Sentence.objects.get(id=client_data.get("document"))
        except:
            raise ValueError("Invalid or missing 'document' value passed in annotation data.")
        obj.set_guid()
        obj.data = "{ }"
        obj.update_from_json(client_data)
        obj.save()
        return obj.as_json(request.user)  # Spec wants redirect but warns of browser bugs, so return the object.


class Annot(BaseStorageView):
    http_method_names = ['get', 'put', 'delete']

    def get(self, request, guid):
        # read. Returns the annotation.
        obj = Annotation.objects.get(guid=guid)  # exception caught by base view
        return obj.as_json(request.user)

    def put(self, request, client_data, guid):
        # update. Updates the annotation.
        obj = Annotation.objects.get(guid=guid)  # exception caught by base view

        if not obj.can_edit(request.user):
            raise PermissionDenied("You do not have permission to modify someone else's annotation.")

        obj.update_from_json(client_data)
        obj.save()
        return obj.as_json(request.user) # Spec wants redirect but warns of browser bugs, so return the object.

    def delete(self, request, guid):
        obj = Annotation.objects.get(guid=guid)  # exception caught by base view

        if not obj.can_edit(request.user):
            raise PermissionDenied("You do not have permission to delete someone else's annotation.")

        obj.delete()
        return None # response handled by the base view


class Search(BaseStorageView):
    http_method_names = ['get']

    def get(self, request):
        try:
            document = Sentence.objects.get(id=request.GET.get("document"))
        except:
            raise ValueError("Invalid or missing 'document' value passed in the query string.")
        qs = Annotation.objects.filter(document=document)
        return {
            "total": qs.count(),
            "rows": Annotation.as_list(qs=qs, user=request.user)
		}


class EditorView2(TemplateView):
    template_name = 'annotator/viewtest.html'
    jquery = """jQuery(function ($) {
                $('#***').annotator().annotator('addPlugin', 'Tags').annotator('addPlugin', 'Corr')
                    .annotator('addPlugin', 'ReadOnlyAnnotations')
                    .annotator('addPlugin', 'Store', {prefix: '{{storage_api_base_url}}',
                          annotationData: {'document': ***},
                          loadFromSearch: {'document': ***}});
                    });"""


    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            raise PermissionDenied("You do not have permission to view this page.")
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super(EditorView2, self).get_context_data(**kwargs)
        context['storage_api_base_url'] = reverse('annotations:annotator.root')[0:-1]  # chop off trailing slash
        d1 = get_object_or_404(Document, id=kwargs['doc_id'])
        s1 = Sentence.objects.filter(doc_id=kwargs['doc_id'])
        context['j'] = []
        for sent in s1:
            context['j'].append(self.jquery.replace('***',
                                                    str(sent.id)).replace('{{storage_api_base_url}}',
                                                                          context['storage_api_base_url']))
        context['data'] = [(d1,s1)]
        context['doc_id'] = kwargs['doc_id']
        return context


def delete_duplicates(arr):
    s = []
    for i in arr:
        if i not in s:
            s.append(i)
    return s


def user_annotations(request):
    if not request.user.is_authenticated():
        raise PermissionDenied("You do not have permission to view this page.")
    user = request.user
    sents = [ann.document for ann in user.annotation_set.order_by('-updated')]
    sents = delete_duplicates(sents)
    jq = []
    for sent in sents:
        jq.append(jquery.replace('***', str(sent.id)))
    return render_to_response('annotator/mysentences.html',
                              {'sents': sents, 'j':jq},
                              context_instance=RequestContext(request))



