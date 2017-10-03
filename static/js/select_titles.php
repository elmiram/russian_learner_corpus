<?php 
include("../include/urlvariables.inc.php");
include("../include/templater.php");
$templater = & new EANC_templater;
$templater->loadLanguageFile($interface_language, "../");
?>
$(document).ready(InitWindow, true);
var genreGroups = new Array();

function collect()
{
    if (window.opener && !window.opener.closed)
	{
		if(window.opener.acceptGenresGroupsList)
			window.opener.acceptGenresGroupsList(getGenresGroupsList());
		if(window.opener.acceptTitlesList)
		{
			window.opener.acceptTitlesList(getTitlesList());
			window.close();
		}
		else
		{
			alert("Not found accepting function");
		}
	}
	else
	{
		alert("No opener window detected!");
	}
}


function InitWindow()
{
	if (window.opener && !window.opener.closed)
	{
		if(window.opener.getTitlesList)
		{
			acceptTitlesList(window.opener.getTitlesList());
		}
		else
		{
			alert("Not found function to get the titles list");
		}
		if(window.opener.getGenresGroupsList)
			acceptGenresGroupsList(window.opener.getGenresGroupsList());
	}
	else
	{
		alert("No opener window detected!");
	}

}

function acceptTitlesList(acceptingTitlesList)
{
	try
	{
		document.titlesInput = acceptingTitlesList;
 	}
	catch(e)
	{
		alert('Error in function acceptTitlesList:' + e.message);
	}
}
function getTitlesList()
{
	return document.titlesInput;
}
function showGenreContent(item)
{
	var parentContainer = item.parentNode;
	var genresList = parentContainer.getElementsByClassName("content");
	for(var i = 0; i < genresList.length; i++)
	{
		Element.toggle(genresList[i]);
	}
}
function showSubcorpus(genre, first)
{
	titlesDialog = window_open
	(
		"showTitles.php?genre=" + genre + "&start=" + first, 
		"showSubcorpus",
		"width=695, height=460, resizable=yes"
	);
	titlesDialog.focus();
	return false;
}
function clearTitlesList()
{
	document.titlesInput = "";
	for(var groupID in genreGroups)
	{
		if(typeof(genreGroups[groupID]) != "function")
			acceptGenreGroupSize(groupID, 0);
	}
	genreGroups = new Array();
	//genreGroups.clear();
}

function acceptGenreGroupSize(groupID, newValue)
{
	genreGroups[groupID] = newValue;
	var group = $("#" + groupID);
	if(group != null)
	{
		if(newValue > 0)
		{
			group.text("(" + newValue + " <? echo $templater->localizeOneWord("SC_TITLES_SELECTED");?>)");
			group.addClass("filled");
		}
		else
		{
			group.text("");
			group.removeClass("filled");
		}
	}
	else
		alert('Not found group span for group:' + groupID);
}
function getGenresGroupsList()
{
	var groupsList = "";
	for(var groupID in genreGroups)
	{
		if(typeof(genreGroups[groupID]) != "function")
		{
			if(groupsList != "")
				groupsList += "&";
			groupsList += groupID + "=" + genreGroups[groupID];
		}
	}
	return groupsList;
}
function acceptGenresGroupsList(strList)
{
	if(strList && strList.length > 0)
	{
		genreGroups = new Array();
		var groupsArray = strList.split("&");
		for(var i = 0; i < groupsArray.length; i++)
		{
			var keyValuePair = groupsArray[i].split("=");
			acceptGenreGroupSize(keyValuePair[0], new Number(keyValuePair[1]));
		}
	}
}