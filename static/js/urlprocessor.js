//Event.observe(window, "load", CompleteUrlVars);
window.onload = CompleteUrlVars;

function CompleteUrlVars()
{
	AddVarsToUrls();
	AddVarsToForms();
}
function AddVarsToUrls()
{
	for(var i = 0; i < document.links.length; i++)
	{
		var processLink = document.links[i];
		if( processLink.getAttribute("ignoreUrlComplete") )
			continue;
		processLink.href = AddVarsToOneLink(processLink.href);
	}
}
function AddVarsToOneLink(linkUrl)
{
	if(linkUrl == "" || linkUrl == "#" || linkUrl.match("javascript"))
		return linkUrl;
	// TODO: Check if this link leads to Javascript exactly
	if(typeof(GLOBAL_VARS) != "undefined")
	{
		for(var varKey in GLOBAL_VARS)
		{
			if(typeof(GLOBAL_VARS[varKey]) == "string")
				linkUrl = AddParameterToLink(linkUrl, varKey, GLOBAL_VARS[varKey]);
		}
	}
	return linkUrl;
}
function AddParameterToLink(linkUrl, parameterName, parameterValue)
{
	var WhatMatch = new RegExp("\\?" + parameterName);
	var AndMatch = new RegExp("\\&" + parameterName);

	if(linkUrl == "" || linkUrl == "#" || linkUrl.match("javascript"))
		return linkUrl;
	if
	(
		!(
			linkUrl.match(WhatMatch) || 
			linkUrl.match(AndMatch)
		)
	)
	{
		return linkUrl + (linkUrl.match("\\?") ? "&" : "?") + parameterName + "=" + parameterValue;
	}
	else
		return linkUrl;
}

function AddVarsToForms()
{
	if(typeof(GLOBAL_VARS) == 'undefined')
		return;
	for(var i = 0; i < document.forms.length; i++)
	{
		var formToProcess = document.forms[i];
		AddVarsToForm(formToProcess);
	}
}
function AddVarsToForm(formToProcess)
{
	for(var parameterKey in GLOBAL_VARS)
	{
		if(typeof(GLOBAL_VARS[parameterKey]) == 'string')
		{
			if(typeof(formToProcess.elements[parameterKey]) == 'undefined')
			{
				var hiddenInput = document.createElement("input");
				hiddenInput.type = "hidden";
				hiddenInput.name = parameterKey;
				hiddenInput.value = GLOBAL_VARS[parameterKey];
				formToProcess.appendChild(hiddenInput);
			}
		}
	}
}

function window_open(windowUrl, windowName, windowParams)
{
	return window.open(AddVarsToOneLink(windowUrl), windowName, windowParams);
}

function GetCheckboxes()
{
	if(document.forms.length > 0)
	{
		var retStr = "";
		for(var i = 0, len = document.forms.length; i < len; i++)
			retStr += GetFormCheckboxes(document.forms[i]);
		return retStr;
	}
	else
		return null;
}
function GetFormCheckboxes(frm)
{
	if(!frm)
		return null;
	var ret = "";
	var els = frm.elements;
	for (var i = 0; i < els.length; i++)
	{
		if(els[i].type == "checkbox")
		{
			if(els[i].checked)
			{
				ret += "|" + els[i].value;
			}
		}
	}
	if(ret.length == 0 && els.length > 0)
		return "nothing-selected";
	else
		return ret;
}
function SetCheckboxes(strValue)
{
	if(document.forms.length > 0)
	{
		for(var i = 0; i < document.forms.length; i++)
		{
			SetFormCheckboxes(document.forms[i], strValue);
		}
	}
}
function SetFormCheckboxes(frm, strValue)
{
	if(strValue != null && strValue.length > 0)
	{
		var els = frm.elements;
		var arValues = CompactArrayDelimiter(strValue, '|');
		for (var i = 0; i < els.length; i++)
		{
			if(els[i].type == "checkbox")
			{
				if(jQuery.inArray(els[i].value, arValues) > -1 )
					els[i].checked = true;
				else
					els[i].checked = false;
			}
		}
	}
}

function CollectTextInputs()
{
	if(document.forms.length > 0)
	{
		var retStr = "";
		for(var i = 0; i < document.forms.length; i++)
		{
			retStr += CollectFormTextInputs(document.forms[i]);
		}
		return retStr;
	}
}
function CollectFormTextInputs(frm)
{
	if(!frm)
		return null;
	var ret = "";
	var els = frm.elements;
	for (var i = 0; i < els.length; i++)
	{
		var oneEl = els[i];
		if(oneEl.type == "text" || oneEl.type == "hidden")
		{
			if(!GLOBAL_VARS[oneEl.name])
				ret += "&" + oneEl.name + "=" + encodeURIComponent(oneEl.value);
		}
	}
	return ret;
}
function SetTextInputs(strValue)
{
	if(document.forms.length > 0)
	{
		for(var i = 0; i < document.forms.length; i++)
		{
			SetFormTextInputs(document.forms[i], strValue);
		}
	}
}
function SetFormTextInputs(frm, strValue)
{
	if(strValue != null && strValue.length > 0)
	{
		var els = frm.elements;
		var arValues = CompactArray(strValue);
		for(var i = 0; i < arValues.length; i++)
		{
			var keyValuePair = arValues[i].split("=");
			if(!GLOBAL_VARS[keyValuePair[0]])
			{
				if(els[keyValuePair[0]])
					els[keyValuePair[0]].value = decodeURIComponent(keyValuePair[1]);
			}
		}
	}
}

function CollectSelectInputs()
{
	if(document.forms.length > 0)
	{
		var retStr = "";
		for(var i = 0; i < document.forms.length; i++)
		{
			retStr += CollectFormSelectInputs(document.forms[i]);
		}
		return retStr;
	}
}
function CollectFormSelectInputs(frm)
{
	if(!frm)
		return null;
	var ret = "";
	var els = frm.elements;
	for (var i = 0; i < els.length; i++)
	{
		var oneEl = els[i];
		if(oneEl.type == "select-one")
		{
			if(!GLOBAL_VARS[oneEl.name])
				ret += "&" + oneEl.name + "=" + encodeURIComponent(oneEl.value);
		}
	}
	return ret;

}
function SetSelectInputs(strValue)
{
	if(document.forms.length > 0)
	{
		for(var i = 0; i < document.forms.length; i++)
		{
			SetFormSelectInputs(document.forms[i], strValue);
		}
	}
}
function SetFormSelectInputs(frm, strValue)
{
	if(strValue != null && strValue.length > 0)
	{
		var els = frm.elements;
		var arValues = CompactArray(strValue);
		for(var i = 0; i < arValues.length; i++)
		{
			var keyValuePair = arValues[i].split("=");
			if(!GLOBAL_VARS[keyValuePair[0]])
			{
				if(els[keyValuePair[0]])
				{
					var el = els[keyValuePair[0]];
					if(el.type != "select-one")
						continue;

					for(var j = 0; j < el.options.length; j++)
					{
						if(el.options[j].value == keyValuePair[1])
						{
							el.options[j].selected = true;
							break;
						}
					}
				}
			}
		}
	}
}

function CompactArray(strValue)
{
	return jQuery.grep(strValue.split("&"), function(a) { return a!=null; });
}
function CompactArrayDelimiter(strValue, strDelimiter)
{
	return jQuery.grep(strValue.split(strDelimiter), function(a) { return a!=null; });
}