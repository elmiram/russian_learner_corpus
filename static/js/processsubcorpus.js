function collect()
{
	if(!document.subcorpusForm)
	{
		alert('No subcorpus form is found!');
		window.close();
	}

	var docsList = "";
	if(document.preparedDocsList)
	{
		docsList = document.preparedDocsList;
	}
	else
	{
		var els = document.subcorpusForm.elements;
		for (var i = 0; i != els.length; i++)
		{
			var el = els[i];
			if (el.type != 'checkbox') continue;
			if (el.checked)
			{
				try
				{
					docsList += (docsList != "" ? "," : "") + el.value;
				}
				catch (e)
				{
					alert('Exception for ' + el.value);
				}
			}
		}
		if(docsList.length == 0)
			docsList = "0";
	}

	if (window.opener && !window.opener.closed)
	{
		if(window.opener.AcceptSubcorpusQuery && !document.preparedDocsList)
		{
			window.opener.AcceptSubcorpusQuery(els["subcorpus_query"].value);
		}
		
		if(window.opener.AcceptIDList)
		{
			window.opener.AcceptIDList(docsList);
		}

		if(window.opener.AcceptWordsAmount)
		{
			window.opener.AcceptWordsAmount(selectedWordsAmount, totalWordsAmount);
		}
		window.close();
		//document.getElementById("SessionDocList").value = docsList;
		//document.getElementById("subcorpusForm").submit();
	}
	else
	{
		alert("No opener window detected!");
	}
}
function uncheckAll()
{
	setAllStatuses(false);
}
function checkAll()
{
	setAllStatuses(true);
}
function setAllStatuses(newStatus)
{
	var els = document.subcorpusForm.elements;
	var docsList = "";
	for (var i = 0; i != els.length; i++)
	{
		var el = els[i];
		if (el.type != 'checkbox') continue;
		if(el.checked != newStatus)
		{
			el.checked = newStatus;
			CheckBoxProcess(el);
		}
	}
}

function CheckBoxProcess(checkbox)
{
	selectedWordsAmount = selectedWordsAmount + 
		(checkbox.checked ? wordsAmount[checkbox.value] : -wordsAmount[checkbox.value]);
	$("#words_amount").text(ThousandDelimiter(selectedWordsAmount.toString()));
	selectedDocumentsAmount += (checkbox.checked ? 1 : -1);
	$("#docs_amount").text(ThousandDelimiter(selectedDocumentsAmount.toString()));
	$("#words_percentage").text(new Number(100 * selectedWordsAmount / totalWordsAmount).toFixed(2) + '%');
}
function ThousandDelimiter(str)
{
	if(str.length <= 3)
		return str;
	else
	{
		return ThousandDelimiter(str.substr(0, str.length - 3)) + " " + str.substr(str.length - 3);
	}
}