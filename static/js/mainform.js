function bodyOnLoad()
{
	MM_preloadImages(
		'images/hghlt_lt.png',
		'images/hghlt_border_top_dark.png',
		'images/hghlt_border_top.png',
		'images/hghlt_rt.png',
		'images/hghlt_border_left.png',
		'images/hghlt_border_right.png',
		'images/hghlt_lb.png',
		'images/hghlt_border_bottom_dark.png',
		'images/hghlt_border_bottom.png',
		'images/hghlt_rb.png','images/px.png'
	);
	$('#contexts_div').css("height", document.body.clientHeight - 100);
	//document.getElementById('contexts_div').style.height = document.body.clientHeight-100;
}

function bodyOnResize()
{
	$('#contexts_div').css("height", document.body.clientHeight - 100);
	//document.getElementById('contexts_div').style.height = document.body.clientHeight-100;
}

function changeTab(formName, sender) // sender = lemma or word
{
	if (sender=="lemma")
	{
		document.getElementById(formName+"_lemma").className="menu lemma active";
		document.getElementById(formName+"_word").className="menu word without_right_border";
		document.getElementById(formName+"_tran").className="menu tran without_left_border";
		document.getElementById(formName+"_wf_flag").value="0";
	}

	if (sender=="word")
	{
		document.getElementById(formName+"_lemma").className="menu lemma";
		document.getElementById(formName+"_word").className="menu word active";
		document.getElementById(formName+"_tran").className="menu tran";
		document.getElementById(formName+"_wf_flag").value="1";
	}

	if (sender=="tran")
	{
		document.getElementById(formName+"_tran").className="menu tran active";
		document.getElementById(formName+"_word").className="menu word";
		document.getElementById(formName+"_lemma").className="menu lemma";
		document.getElementById(formName+"_wf_flag").value="2";
	}
}
//update status bar. �������� ����� � ������ �� ����� �������
function bu(percent, seconds, total)
{
	try
	{
		if($('#complete').length > 0)
			//$('#complete').css(percent + '%');
			document.getElementById('complete').style.width = percent + '%';
		if($("#total_percent").length > 0)
			$("#total_percent").val(percent + '% ' + document.complete_caption);
		//document.getElementById('total_percent').value = percent + '% ' + document.complete_caption;
		if($("#remaining_total").length > 0)
			$("#remaining_total").val(seconds + ' ' + document.sec_caption + ' ' + document.elapsed_caption + ' / ' + total + ' ' + document.sec_caption + ' ' + document.total_caption);
		//document.getElementById('remaining_total').value = seconds + ' ' + document.sec_caption + ' ' + document.elapsed_caption + ' / ' + total + ' ' + document.sec_caption + ' ' + document.total_caption;
	}
	catch(e)
	{
		alert('Exception:' + e);
	}
}
function showHideAdvancedBlock(blockName)
{
	if (document.getElementById("hidden_advanced_" + blockName).style.display == "none")
	{
		document.getElementById("hidden_advanced_" + blockName).style.display = "";
		document.getElementById("adv" + blockName).src = "../images/whiteArrowUp.gif";
	}
	else
	{
		document.getElementById("hidden_advanced_" + blockName).style.display = "none";
		document.getElementById("adv" + blockName).src = "../images/whiteArrowDown.gif";
	}
}

function HoverLink()
{
	ChangeArrow('color_white', 'dist');
}
function UnhoverLink()
{
	ChangeArrow('restore_white','dist');
}
function changeAdvancedWhite(num)
{
	changeAdvanced(num, "white");
}
function changeAdvancedNonWhite(num)
{
	changeAdvanced(num, "");
}

function changeAdvanced(num, type)
{
	if (document.getElementById("hidden_advanced_" + num).style.display == "")
	{
		document.getElementById("hidden_advanced_" + num).style.display = "none";
		if (type == "white")
			document.getElementById("adv" + num).src = "../images/ttb_arrow_white.gif";
		else 
			document.getElementById("adv" + num).src = "../images/ttb_arrow.gif";
		return;
	}

	if (document.getElementById("hidden_advanced_" + num).style.display == "none")
	{
		document.getElementById("hidden_advanced_" + num).style.display = "";
		if (type == "white")
			document.getElementById("adv" + num).src = "../images/btt_arrow_white.gif";
		else
			document.getElementById("adv" + num).src = "../images/btt_arrow.gif";
		return;
	}

}

function showDistance()
{
	var i=1;
	while (document.getElementById("distance"+i))
	{
		if (document.getElementById('show_distance').checked)
		{
			document.getElementById("distance"+i).style.display = "";
			document.getElementById("distance_prefs").style.display = "";
		}
		else
		{
			document.getElementById("distance"+i).style.display = "none";
			document.getElementById("distance_prefs").style.display = "none";
		}
		i++;
	}
}

function ChangeArrow(type, num) // color,restore
{

	
	if (document.getElementById("hidden_advanced_"+num).style.display=="none")
	{
		if (type=="color")
		{
			MM_swapImage('adv'+num,'','../images/ttb_arrow_hover.gif','1');
			return;
		}
		if (type=="color_white")
		{
			MM_swapImage('adv'+num,'','../images/ttb_arrow_white_hover.gif','1');
			return;
		}

		if (type=="restore")
		{
			MM_swapImage('adv'+num,'','../images/ttb_arrow.gif','1');
			return;
		}	

		if (type=="restore_white")
		{
			MM_swapImage('adv'+num,'','../images/ttb_arrow_white.gif','1');
			return;
		}				
	}

	if (document.getElementById("hidden_advanced_"+num).style.display=="")
	{
		if (type=="color")
		{
			MM_swapImage('adv'+num,'','../images/btt_arrow_hover.gif','1');
			return;
		}
		if (type=="color_white")
		{
			MM_swapImage('adv'+num,'','../images/btt_arrow_white_hover.gif','1');
			return;
		}

		if (type=="restore")
		{
			MM_swapImage('adv'+num,'','../images/btt_arrow.gif','1');
			return;
		}	

		if (type=="restore_white")
		{
			MM_swapImage('adv'+num,'','../images/btt_arrow_white.gif','1');
			return;
		}				
	}
	
}

function getLex(name) {
	grmDialog = window_open("lex", "lex" + name,
		"width=800, height=500, resizable=yes, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function getGrm(name) {
	grmDialog = window_open("gramsel", "gr" + name,
		"width=800, height=500, resizable=yes, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function getErr(name) {
	grmDialog = window_open("errsel", "err" + name,
		"width=800, height=530, resizable=yes, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function getSubcorpus(name) {
	grmDialog = window_open("subcorpus.php", "subcorpus" + name,
		"width=500, height=530, resizable=no, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function getPreferences(name) {
	prefs = window_open("preferences.php", "preferences" + name,
		"width=390, height=430, resizable=no, scrollbars=1");
	prefs.focus();
	return prefs;
};

function SaveAll()
{
	document.body.onload = function(){prefs.SaveAll();}
}

function getUnderConstruction(name) {
	grmDialog = window_open("frame_parts/underconstruction.html", "underconstruction" + name,
		"width=400, height=200, resizable=no, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function showKeyboard(name) {
	document.getElementById("lex" + name).focus();
	grmDialog = window_open("keyboard_cyrillic.php", "lex" + name, "width=860, height=365, resizable=no, scrollbars=1");
	grmDialog.focus();
	return void(0);
};

function showPrint(target) {
	document.getElementById("show_results").target="_blank";
	document.getElementById("show_results").action=target;
	document.getElementById("show_results").submit();
};

function showHand(obj)
{
	obj.style.cursor = "pointer";
}

function makeLinkStyle(obj,col)
{
	obj.style.color=col;
}

function getFrameLocation(frameName)
{
	if(window.parent.frames)
	{
		return window.parent.frames[frameName].document.location.href;
	}
	else if(window.parent.getElementById(frameName).contentDocument)
	{
		return window.parent.getElementById(frameName).contentDocument.location.href;
	}
}

function ChangeTopLink()
{
	if(navigator.appName!="Netscape")
		top.frames['top_frame'].setLink('onSearch');
}
function EmptyResultsWindow_Submit()
{
	if(navigator.appName!="Netscape")
	{
		var res = top.frames['results_frame'].MakeBlank();
	}
	else
	{
		document.forms[0].submit();
	}
}

function getErrorReport(name)
{
	grmDialog = window_open("error.php?errorLog=" + encodeURIComponent(getFrameLocation("results_frame")), "error" + name, "width=395, height=450, resizable=no, scrollbars=1");
	grmDialog.focus();
	return void(0);
}

function setValueToFormElement(elemName, elemValue)
{
	for(var i=0, len=this.document.forms.length; i < len; i++)
	{
		var theForm = this.document.forms[i];
		if(theForm.elements[elemName] != null)
			theForm.elements[elemName].value = elemValue;
	}
}
function AcceptIDList(idList)
{
	setValueToFormElement("subcorpus", idList);
}
function AcceptSubcorpusQuery(strQuery)
{
	setValueToFormElement("subcorpus_query", strQuery);
}
function DisplayObject(theObj)
{
	var tmp = "";
	for(var i in theObj)
	{
		tmp = tmp + i + "=" + theObj[i] + "\n";
	}
	alert(tmp);
}
function AcceptWordsAmount(selectedWordsAmount, totalWordsAmount)
{
	setValueToFormElement("selected_words_percent", selectedWordsAmount / totalWordsAmount);
}
function AcceptSubcorpusFormCheckboxes(checkboxesList)
{
	document.subcorpus_checkboxes = checkboxesList;
}
function GetSubcorpusFormCheckboxes()
{
	return document.subcorpus_checkboxes;
}
function AcceptSubcorpusFormTextInputs(textInputsList)
{
	document.subcorpus_textInputsList = textInputsList;
}
function GetSubcorpusFormTextInputs()
{
	return document.subcorpus_textInputsList;
}
function AcceptSubcorpusFormSelectInputs(inputsList)
{
	document.subcorpus_selectInputsList = inputsList;
}
function GetSubcorpusFormSelectInputs()
{
	return document.subcorpus_selectInputsList;
}
function getGenresGroupsList()
{
	return document.genresGroupsList;
}
function acceptGenresGroupsList(strList)
{
	document.genresGroupsList = strList;
}

function acceptGramcodesList(subGroup, strList)
{
	if(!document.gramcodesList)
		document.gramcodesList = new Array();
	document.gramcodesList[subGroup] = strList;
}
function getGramcodesList(subGroup)
{
	if(document.gramcodesList)
		return document.gramcodesList[subGroup];
	else
		return null;
}

function CleanForm()
{
	var i = 1;
	while (document.getElementById('lex'+i)) // ���� ���������� ������� - ������ ���������� ��� ���������, ��������� ������� ����� ��������� ������
	{
		document.getElementById('lex'+i).value="";
		document.getElementById('form'+i+'_wf_flag').value="1";
		document.getElementById('gr'+i).value="";
		document.getElementById('gr'+i+'_values').value="";
		document.getElementById('gr'+i+'_flex').value="";
		document.getElementById('er'+i).value="";
		document.getElementById('er'+i+'_values').value="";
		document.getElementById('er'+i+'_flex').value="";

		document.getElementById('case_sensitive_'+i).selectedIndex=0;
		//document.getElementById('distinct_values_'+i).checked=false;
		document.getElementById('nlems_'+i).selectedIndex=0;

		document.getElementById('left_punct_'+i).selectedIndex=0;
		document.getElementById('inner_punct_'+i).selectedIndex=0;
		document.getElementById('right_punct_'+i).selectedIndex=0;
		document.getElementById('position_'+i).selectedIndex=0;

		changeTab('form'+i, 'word');

		i++;
	}
	
	document.getElementById('same_sentence').checked = true;
	document.getElementById('any_distance').checked = false;
	document.getElementById('random_order').checked = false;
	ChangeDistances('same',0);
}
