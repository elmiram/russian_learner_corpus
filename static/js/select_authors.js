//Event.observe(window, "load", InitWindow);
$(document).ready(InitWindow, true);
function collect()
{
    var els = document.authorsForm.elements;
    var authorsList = "";
    for (var i = 0; i != els.length; i++)
	{
        var el = els[i];
        if (el.type != 'checkbox') continue;
        if (el.checked)
			authorsList += "|" + el.value;
    }
    if (window.opener && !window.opener.closed)
	{
		if(window.opener.acceptAuthorsList)
		{
			window.opener.acceptAuthorsList(authorsList);
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
		if(window.opener.getAuthorsList)
		{
			var authorsList = window.opener.getAuthorsList();
			var arList = authorsList.split("|");
			if(arList == null)
				return;
			var els = document.authorsForm.elements;
			for (var j = 0; j < els.length; j++) {
				var el = els[j];
				if (el.type != 'checkbox') continue;
				if(jQuery.inArray(el.value, arList) > -1)
					el.checked = true;
			}
		}
		else
		{
			alert("Not found function to get the authors list");
		}
	}
	else
	{
		alert("No opener window detected!");
	}
}