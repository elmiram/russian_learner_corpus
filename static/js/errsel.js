/*
 * -----------
 * EANC 1.0
 * Название: gramsel.php
 * Автор:    Alexey V.Zelenin (grinka@gmail.com)
 * -----------
 */
/*
-----------
Описание:
	
	Обрабатывает страницу, на которой выбираются грамкоды: gramsel.php

Использование:

	Файл включается в заголовок. Для корректной работы требуется "jQuery.js"

Функции:
	function parse_grms(str)
	function collect()
	function inverse(group)
	function InitWindow()

См. также:
	gramsel.php
-----------
*/

/*
-----------------------------------------------------------------------------------------
function parse_grms(str)

Описание:
	Производит разбор строки, содержашей грамкоды в массив. Строка получается через
	javascript от родительского окна. Разделителем служит запятая с произвольным 
	количеством пробелов.

Параметры:
	str - строка, которую необходимо разобрать

Возвращается:
	массив. Если строка пуста, возвращается пустой массив.
-----------------------------------------------------------------------------------------
*/
function parse_grms(str)
{
	var grms_arr = [];
	if (str == "") return grms_arr;
	var grms_str = new String(str);
	var pattern = /\s*,\s*/
	var groups_list = grms_str.split(pattern);
	var re = /\(([\w ]+)\)/
	var ind = 0;

	for (i = 0; i < groups_list.length; i++)
	{
		if (re.test(groups_list[i])) {
			grms_str = groups_list[i].replace(re, "$1");
			var re2 = /\s+/
			grms_list = grms_str.split(re2);
			for (j = 0; j < grms_list.length; j++)
			{
				grms_arr[ind++] = grms_list[j];
			}
		} else {
			grms_arr[ind++] = groups_list[i];
		}
	}
	return grms_arr;
}
/*
-----------------------------------------------------------------------------------------
function collect()

Описание:

	Производит сбор информации с формы (выделенные чекбоксы)
	и передаёт эту информацию в родительское окно.
	Также собирает строку, конкатенируя значения выделенных чекбоксов через
	"|", передавая её в родительское окно для использования при повторном открытии
	формы "gramsel.php". Эта строка потом будет использоваться в функции InitWindow

	Уникальным образом обрабатывается содержимое поля "flex" - оно передаётся 
	специальному невидимому полю ввода.
	
Использование:

	Функция вызывается при клике на сабмит формы.

-----------------------------------------------------------------------------------------
*/
function collect()
{
  // все элементы формы
  var els = '';
  els = document.getElementById('gramForm').elements;

  // массив для хранения
  var ar = '';
  ar = {};

	// строка, которая будет передаваться родительскому окну для сохранения
  var valuesList = '';

  for (var i = 0; i != els.length; i++)
	{
        var el = els[i];
		// обрабатываем только чекбоксы
        if (el.type != 'checkbox') continue;

        if (el.checked)
		{
			// если чекбокс выбран
			// добавляем его значение к строке для сохранения
			valuesList += '|' + el.value;
			// инициализируем значение в массиве, если раньше его не было
			// ключ - имя элемента
		            if (!ar[el.name]) 
				ar[el.name] = '';
			// добавляем значение элемента к элементу массива
			// magical hack
			ar[el.name] += '|' + el.value;
    }
  }

	// собираем в строку все значения чекбоксов.
	// чекбоксы с одинаковыми именами группируются через "|"
	// Группы чекбоксов конкатенируются через ","
	// Если в группе больше одного значения, они объединяются с помощью круглых скобок
	var s;
	s = '';
	for (i in ar)
	{
		// отрезаем первый символ, так как при сборе строки имитировалась конкатенация
		// через "|" и первый символ всегда равен "|"
		var v = '';
		v = ar[i].substring(1)
		// обрамляем скобками, если требуется
		if (v.indexOf('|') != -1)
			v = '(' + v + ')';
		// склеиваем через запятую
		s += ',' + v;

	}

	// отрезаем первую запятую
  s = s.substring(1);

  sourceName = window.name;
  if (window.opener && !window.opener.closed)
	{
		// передаём параметры родительскому окну
		// список грамкодов в спецформате. Будет как-то использоваться родительским окном
        window.opener.document.forms[0].elements[sourceName].value = s;
		// список значений чекбоксов для сохранения. Будет использоваться при повторном
		// открытии окна выбора грамкодов
		if(window.opener.acceptGramcodesList)
			window.opener.acceptGramcodesList(sourceName, valuesList);
		// делаем видимым контейнер, к вотором показвыается список выбранных гракмодов
		// window.opener.document.getElementById("span_" + sourceName).style.display = "";
	}
  window.close();
}

function collectLexiconFormValues()
{
	var 
		valuesList = {
			toString: "",
			valuesList: ""
		}, 
		foundOne = false,
		hasIntrg = false,
		els = document.getElementById("lexForm").elements;
	for(var i = 0, len = els.length; i < len; i++)
	{
		var el = els[i];
		if(el.type != 'checkbox')
			continue;
		if(el.checked)
		{
			if(el.value == "intrg")
			{
				hasIntrg = true;
				continue;
			}
			var cmplValue = "";
			cmplValue =
				(el.value.indexOf(",") > -1) ?
				"(" + el.value + ")" :
				el.value;
			valuesList.toString += 
				(foundOne ? "|" : "") +
				cmplValue;
			valuesList.valuesList += (foundOne ? "|" : "") + el.value;
			foundOne = true;
		}
	}
	if(hasIntrg)
	{
		if(valuesList.valuesList.length == 0)
		{
			valuesList.valuesList = "intrg";
			valuesList.toString = "intrg";
		}
		else
		{
			valuesList.valuesList += "|" + "intrg";
			valuesList.toString = "(" + valuesList.toString + "),intrg";
		}
	}
	return valuesList;
}

/*
-----------------------------------------------------------------------------------------
function inverse(group)

Описание:

	инвертирует содержимое группы контролов с общим названием.

Использование:

	Вызывается при клике на заголовки групп на форме.

-----------------------------------------------------------------------------------------
*/
function inverse(group)
{
    var els = document.gramForm.elements;
    var ar = {};
    for (var i = 0; i != els.length; i++) {
        var el = els[i];
        if (el.type != 'checkbox') continue;
        if (el.name == group)
            el.checked=!el.checked;
    }
}

/*
-----------------------------------------------------------------------------------------
function InitWindow()

Описание:
	Функция вызывается при инициализации страницы, по событию window.load.
	Устанавливает последные значения для грамкодов, используя скрытое поле в
	форме в родительском окне. В этом поле все значения грамкодов перечислены
	через "|"

-----------------------------------------------------------------------------------------
*/
function InitWindow()
{
	if(window.opener)
	{
		// Получаем от родительского окна информацию об установленных грамкодах
		// восстанавливаем состояние чекбоксов.
		//var openerForm = window.opener.document.forms[0];
		/*
		grms = parse_grms(openerForm.elements[window.name].value);
		var el;
		for (i = 0; i < grms.length; i++)
		{
			el = window.document.getElementById(grms[i]);
			if (el) el.checked = true;
		}
		*/
		// Восстанавливаем значения чекбоксовв, которые были сохранены в родительском окне
		//  в форме в невидимом поле ввода по имени "<window.name>_values", где window_name -
		// имя данного конкретного окна для ввода грамкодов.
		if(window.opener.getGramcodesList(window.name))
		{
			var valuesList = window.opener.getGramcodesList(window.name);

			// получаем список всех грамкодов
			if(valuesList != null)
			{
				// разносим в массив. Разделитель - "|"
				var valuesArray; 
				valuesArray = valuesList.split("|");
				var els; 
				els = document.forms["gramForm"].elements;
				
				InitFormControls(els, valuesArray);
				//InitFormControls(document.forms["lexForm"].elements, valuesArray);
			}
		}
	}
	// инициализируем обработчики для 
	//$("#headerTrigger a.grammar").click(showGrammar);
	//$("#headerTrigger a.lexicon").click(showLexicon);
}

function InitFormControls(els, valuesArray)
{
	for(var i = 0; i < els.length; i++)
	{
		var el; 
		el = els[i];
		// для чекбоксов
		if (el.type == 'checkbox')
		{
			for (var k = 0; k < valuesArray.length; k++)
			{
				if(el.value == valuesArray[k])
				{
					// если значение значение чекбокса есть среди сохранённых,
					// устанавливаем чекбокс
					el.checked = true;
				}
			}
		}
		// для дропдаун контролов
		if (el.type == 'select-one')
		{
			// проверяем все значения внутри дропдауна
			for(var j = 0; j < el.length; j++)
			{
				for (var k = 0; k < valuesArray.length; k++)
				{
					if(el.options[j].value == valuesArray[k])
					{
						// если значение найдено - делаем данную опцию выбранной
						el.options[j].selected = true;
					}
				}
			}
		}

	}
}
function showGrammar()
{
	if($("a.grammar").hasClass("activeA"))
		return;
	$("a.grammar").addClass("activeA");
	//$("a.lexicon").removeClass("activeA");
	//$("#main_lexicon").fadeOut();
	$("#main_gram").fadeIn();
}
function showLexicon()
{
	if($("a.lexicon").hasClass("activeA"))
		return;
	$("a.lexicon").addClass("activeA");
	$("a.grammar").removeClass("activeA");
	$("#main_gram").fadeOut();
	//$("#main_lexicon").fadeIn();
}
