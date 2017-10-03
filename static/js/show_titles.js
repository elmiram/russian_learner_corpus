$(document).ready(InitWindow);

var arTitles = new Array();

function collect()
{
    var els = document.titlesForm.elements;
	var checkedAmount = 0;
    for (var i = 0; i != els.length; i++)
	{
        var el = els[i];
        if (el.type != 'checkbox') continue;
        if (el.checked)
		{
			if(jQuery.inArray(el.value, arTitles) == -1)
				arTitles.push(el.value);
			checkedAmount++;
		}
		else
		{
			if(jQuery.inArray(el.value, arTitles) != -1)
				arTitles = arTitles.without(el.value);
		}
    }
    if (window.opener && !window.opener.closed)
	{
		if(window.opener.acceptGenreGroupSize)
			window.opener.acceptGenreGroupSize(genreGroupID, checkedAmount);
		if(window.opener.acceptTitlesList)
		{
			window.opener.acceptTitlesList(arTitles.join(","));
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
			var titlesList = window.opener.getTitlesList();
			if(titlesList && titlesList.length > 0)
			{
				arTitles = titlesList.split(",");
				if(arTitles == null)
				{
					alert('No titles saved in parent window');
					return;
				}
				var els = document.titlesForm.elements;
				for (var j = 0; j < els.length; j++)
				{
					var el = els[j];
					if (el.type != 'checkbox') continue;
					if(jQuery.inArray(el.value, arTitles) > -1)
					{
						el.checked = true;
						SelectParentRow(el);
					}
				}
			}
		}
		else
		{
			alert("Not found function to get the titles list");
		}
	}
	else
	{
		alert("No opener window detected!");
	}

}
