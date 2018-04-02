#  -- coding: utf8 --
__author__ = 'elmira'

import MySQLdb as mdb

from heritage_corpus.settings import DATABASES

USER = DATABASES['default']['USER']
PASSWORD = DATABASES['default']['PASSWORD']
NAME = DATABASES['default']['NAME']


class Database(object):
    """Класс для общения с базой данных MySQL"""
    
    def __init__(self):
        """Создать соединение с базой данных.

        В параметрах соединения указывается хост, логин, пароль, название базы данных, кодировка.
        """
        self._connection = mdb.connect('', USER, PASSWORD, NAME, charset='utf8')

    def commit(self):
        self._connection.commit()

    def execute(self, q):
        """Вернуть результат выполнения запроса в виде массива кортежей.

        Каждый кортеж - строка базы данных, сформированная по запросу.
        """
        self.cur = self._connection.cursor()  # mdb.cursors.DictCursor
        self.cur.execute(q)
        res = self.cur.fetchall()
        self.cur.close()
        return res
