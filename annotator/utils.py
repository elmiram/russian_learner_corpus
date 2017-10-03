#  -- coding: utf8 --
u"""Скрипты для обработки текста майстемом."""
__author__ = 'elmira'
import uuid
import re
import subprocess
import codecs
import os
from heritage_corpus.settings import PATH_TO_MYSTEM, TEMPORARY_FILE_LOCATION

regSe = re.compile(u'<se>(.*?)</se>', flags=re.U | re.DOTALL)  # находит предложение в тэгах <se> </se>
regWord = re.compile(u'^(.*?)<w>(.*?)(<ana.*/>)?</w>(.*)$', flags=re.U)  # находит слово в тэгах <w> </w>
regAna = re.compile(u'<ana lex="(.*?)" gr="(.*?)" />', flags=re.U)  # находит разбор в тэгах <ana> </ana>


# this class is needed to easily access information about a word
class Word:
    def __init__(self, pl, wf, anas, pr, ttip):
        self.pl, self.wf, self.anas, self.pr, self.tooltip = pl, wf, anas, pr, ttip
        # левая пунктуация, словоформа, массив разборов, правая пунктуация, тултип с разборами


# this class is needed to easily access information about a sentence
class Sent:
    def __init__(self, text, words):
        self.text, self.words = text, words
        # текст, массив слов класса Word


def mystem(text):
    u"""
    Записывает текст в файл, передает этот файл майстему,
    а затем результат работы майстема передает в функцию-обработчик.
    Возвращает число слов в тексте и массив предложений.

    :param text: текст
    :return: кортеж (число слов, массив предложений)
    Каждое предложение в массиве - объект класса Sent.
    """
    # todo почему-то не получается сразу передать текст в майстем.
    # todo приходится сначала записывать текст в файл, читать, и потом удалять его.
    fname = TEMPORARY_FILE_LOCATION + '/temp' + str(uuid.uuid4()) + '.txt'
    f = codecs.open(fname, 'w', 'utf-8')
    f.write(text.replace('\r\n', '\r').replace('\n', '\r'))
    f.close()

    args = [PATH_TO_MYSTEM, '-cnisd', '--format', 'xml', '--eng-gr', fname]  # Temp+ hash, del temp
    # todo можно вместо xml задать json и обрабатывать было бы проще - переписать?
    p = subprocess.Popen(args, stdout=subprocess.PIPE)
    output = p.stdout.read()  # this is mystem xml
    os.remove(fname)

    output = get_sentences(output)  # returns tuple (num of words, arr of sents), each sent has .text and .words=array
    return output


def get_sentences(xml):
    u"""
    Обрабатывает xml, который вернул майстем.

    :param xml: результат работы майстема (строка)
    :return: число слов в тексте, массив предложений
    """
    arr = [i.strip().split('\n') for i in regSe.findall(xml)]
    words = 0  # how many words
    T = []
    for se in arr:
        se_text = ''
        se_words = []
        for word in se:
            search = regWord.search(word)
            if search is None:
                continue
            words += 1
            if search is None: print word
            punctl, wordform, anas, punctr = search.group(1), search.group(2), \
                                             search.group(3), search.group(4).replace('\r', ' ')
            if anas:
                anas = regAna.findall(anas)  # массив пар, в каждой паре - лемма + разбор
            else:
                anas = []
            tooltip = tooltip_generator(anas)
            W = Word(punctl, wordform, anas, punctr, tooltip)
            se_words.append(W)
            se_text += punctl + wordform + punctr
        S = Sent(se_text, se_words)
        T.append(S)
    return words, T


def tooltip_generator(anas):
    u"""
    Создает html-код, который вставляется в тултип
    (окошко с морфологической информацией, которое всплывает, если навести мышкой на слово в окне выдачи результатов).

    :param anas: массив морфологических разборов
    :return: html-код тултипа (строка)
    """
    # print anas
    d = {}
    for ana in anas:
        lem = ana[0]
        bastard = False
        if 'qual="' in lem:
            lem = lem.split('"')[0]
            bastard = True
        lex, gram = ana[1].split('=')
        if bastard:
            lex = 'bastard,' + lex
        if lem + ', ' + lex not in d:
            d[lem + ', ' + lex] = gram
        else:
            d[lem + ', ' + lex] += '<br>' + gram
    arr = ['<b>'+key+'</b><br>' + d[key] for key in d]
    return '<hr>'.join(arr)
    # todo generate tooltip with morpho <- merge similar morphos!!
