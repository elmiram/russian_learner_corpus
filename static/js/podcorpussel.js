$(document).ready(InitScripts, true);
var subcorpusForm;
var arrAuthorsList = null, arrTitlesList = null;

function turnGroup(groupName)
{
	//turnForceGroup(groupName, null);
}
function turnForceGroup(groupName, force)
{
	// seems this function is not used any more
	var working = $(groupName);
	if(working)
	{
		var triggers = working.getElementsByClassName("formtrigger");
		for(var i=0, len=triggers.length; i<len; i++)
		{
			if(force == "on")
				Element.removeClassName(triggers[i], "off");
			else if(force == "off")
				Element.addClassName(triggers[i], "off");
			else
				Element.toggleClassName(triggers[i], "off");
		}
		var contents = working.getElementsByClassName("content");
		for(var i = 0, len = contents.length; i < len; i++)
		{
			if(force == "on")
				contents[i].show();
			else if(force == "off")
				contents[i].hide();
			else
				contents[i].toggle();
		}
	}

}
function turnAllChecks(checkName)
{
//	turnForceGroup(checkName, "on");
	var groupCheckbox = subcorpusForm.elements[checkName + "_group"];
	for (var i = 0; i != subcorpusForm.elements.length; i++)
	{
		var el = subcorpusForm.elements[i];
		if (el.type != 'checkbox') continue;
		if (el.name == checkName || el.name == checkName + "[]")
			el.checked = groupCheckbox.checked;
	}
}
function clearAllCheckboxes()
{
	changeAllCheckboxes(false);
}
function selectAllCheckboxes()
{
	changeAllCheckboxes(true);
}
function changeAllCheckboxes(newCheckValue)
{
	for (var i = 0; i != subcorpusForm.elements.length; i++)
	{
		var el = subcorpusForm.elements[i];
		if (el.type == 'checkbox')
			el.checked = newCheckValue;
	}
}

function ResetSubcorpus()
{
	document.getElementById('selectionInfo').innerHTML = "";
	document.getElementById('selectionInfo').style.visibility = "hidden";
	document.getElementById('f_authorslist').value = "";
	document.getElementById('f_titleslist').value = "";

	document.getElementById('dateFrom').value = yearDefaultValue1
	document.getElementById('dateTo').value = yearDefaultValue2

	document.getElementById('dateFrom').className = "sub_grayed"
	document.getElementById('dateTo').className = "sub_grayed"

	document.getElementById('author_sex').options[0].selected = "true"
	document.getElementById('texttype_orig_trans').options[0].selected = "true"
//	document.getElementById('texttype_age').options[0].selected = "true"
	document.getElementById('texttype_orth').options[0].selected = "true"

	selectAllCheckboxes();

}

function setParent(checkName)
{
	var groupCheckbox = subcorpusForm.elements[checkName + "_group"];
	var foundChecked = false;
	var foundUnchecked = false;
	for (var i = 0; i != subcorpusForm.elements.length; i++)
	{
		var el = subcorpusForm.elements[i];
		if (el.type != 'checkbox') continue;
		if ((el.name == checkName || el.name == checkName + "[]") && el.checked)
			foundChecked = true;
		else
			foundUnchecked = true;
	}
	groupCheckbox.checked = foundChecked;
}
function InitScripts()
{
	subcorpusForm = document.forms["subcorpus"];
	if (window.opener && !window.opener.closed)
	{
		if(window.opener.GetSubcorpusFormCheckboxes)
			SetFormCheckboxes(subcorpusForm, window.opener.GetSubcorpusFormCheckboxes());
		if(window.opener.GetSubcorpusFormTextInputs)
			SetFormTextInputs(subcorpusForm, window.opener.GetSubcorpusFormTextInputs());
		if(window.opener.GetSubcorpusFormSelectInputs)
			SetFormSelectInputs(subcorpusForm, window.opener.GetSubcorpusFormSelectInputs());
		if(window.opener.getGenresGroupsList)
			acceptGenresGroupsList(window.opener.getGenresGroupsList());
		CollectSelectedValues();
	}
	$(subcorpusForm).bind("submit", SaveAllValues);
	setDateClass($("dateFrom"));
	setDateClass($("dateTo"));
}
function setDateClass(obj)
{
	obj = $(obj);
	if(obj.val() == yearDefaultValue1 || obj.val() == yearDefaultValue2)
		obj.addClass("sub_grayed");
	else
		obj.removeClass("sub_grayed");
}
function autoclear(obj, checkValue)
{
	obj = $(obj);
	if(obj.val() == checkValue)
	{
		obj.val("");
		setDateClass(obj);
	}
}
function restoredefault(obj, checkValue)
{
	obj = $(obj);
	if(jQuery.trim(obj.val()) == "")
	{
		obj.val(checkValue);
		setDateClass(obj);
	}
}
function CollectSelectedValues()
{
	try
	{
		var titles = getTitlesList();
		var authors = getAuthorsList();

		$("#selectionInfo").show();
		document.getElementById("selectionInfo").style.visibility = "visible";
		var ttl = captionSelected;
		if(authors.length > 0)
		{
			var arrAuthorsList = authors.split("|");
			ttl += ((arrAuthorsList.length-1)) + " " 
				+ ((arrAuthorsList.length-1) == 1 ? captionAuthor : captionAuthors);
			if(titles.length > 0)
				ttl += ", ";
		}
		if(titles.length > 0)
		{
			var arrTitlesList = titles.split(",");
			ttl += ((arrTitlesList.length)) + " " 
				+ ((arrTitlesList.length) == 1 ? captionTitle : captionTitles);
		}
		$("#selectionInfo").text(ttl);

		if(titles.length == 0 && authors.length == 0)
		{
			$("#selectionInfo").text(" ");
			return;
		}

	}
	catch(ex)
	{
		//alert("error in function CollectSelectedValues:" + ex.message);
	}
}

function selectAuthor()
{
	authorsDialog = window_open(
		"authors.php", 
		"authors",
		"width=710, height=460, resizable=no"
	);
	authorsDialog.focus();
	return void(0);
}
function selectTitle()
{
	titlesDialog = window_open(
		"titles.php", 
		"titles",
		"width=695, height=460, resizable=yes"
	);
	titlesDialog.focus();
	return void(0);
}
function acceptAuthorsList(acceptingAuthorsList)
{
	try
	{
		var form = $("#subcorpus").get(0);
		if(form)
		{
			var authorsInput = form.elements["authorslist"];
			authorsInput.value = acceptingAuthorsList;
			CollectSelectedValues();
		}
	}
	catch(e)
	{
		alert('Error in function acceptAuthorsList:' + e.message);
	}
}
function getAuthorsList()
{
		var form = $("#subcorpus").get(0);
		if(form)
		{
			var authorsInput = form.elements["authorslist"];
			return authorsInput.value;
		}
		else
			return "";
}
function acceptTitlesList(acceptingTitlesList)
{
	try
	{
		var form = $("#subcorpus").get(0);
		if(form)
		{
			var titlesInput = form.elements["titleslist"];
			titlesInput.value = acceptingTitlesList;
			CollectSelectedValues();
		}
		else
			return "";
 	}
	catch(e)
	{
		alert('Error in function acceptTitlesList:' + e.message);
	}
}
function getTitlesList()
{
	var form = $("#subcorpus").get(0);
	if(form)
	{
		var titlesInput = form.elements["titleslist"];
		return titlesInput.value;
	}
	else
		return "";
}

function SaveAllValues()
{
	if (window.opener && !window.opener.closed)
	{
		if(window.opener.AcceptSubcorpusFormCheckboxes)
		{
			window.opener.AcceptSubcorpusFormCheckboxes(GetCheckboxes());
		}
		if(window.opener.AcceptSubcorpusFormTextInputs)
		{
			window.opener.AcceptSubcorpusFormTextInputs(CollectTextInputs());
		}
		if(window.opener.AcceptSubcorpusFormSelectInputs)
		{
			window.opener.AcceptSubcorpusFormSelectInputs(CollectSelectInputs());
		}
		if(window.opener.acceptGenresGroupsList)
			window.opener.acceptGenresGroupsList(getGenresGroupsList());
	}

}

function getGenresGroupsList()
{
	return document.genresGroupsList;
}
function acceptGenresGroupsList(strList)
{
	document.genresGroupsList = strList;
}