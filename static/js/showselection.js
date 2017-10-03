//Event.observe(window, "load", SetCheckboxHandlers);
$(window).bind("load", SetCheckboxHandlers);

function SetCheckboxHandlers()
{
	if(document.forms.length > 0)
	{
		var els = document.forms[0].elements;
		for (var j = 0; j < els.length; j++)
		{
			var el = els[j];
			if (el.type != 'checkbox') continue;
			{
				$(el).bind("click", SelectCheckboxRow);
				//Event.observe(el, "click", SelectCheckboxRow);
			}
		}
	}
}
function SelectCheckboxRow()
{
//	var cbk = Event.element(ev);
// раскомментировать эту строку, если потребуется когда-то выделять целую 
// строчку в таблице с чекбоксом
//	SelectParentRow(cbk);
	if(typeof(CheckBoxProcess) == "function")
		CheckBoxProcess(this);
}
function SelectParentRow(itemToChange)
{
	var newCheckStatus = itemToChange.checked;
	$(itemToChange).parent("tr").each(function(newCheckStatus) {
		if(newCheckStatus)
			$(this).addClass("selected");
		else
			$(this).removeClass("selected");
	});
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
	if(document.forms.length > 0)
	{
		for (var i = 0; i != document.forms[0].elements.length; i++)
		{
			var el = document.forms[0].elements[i];
			if (el.type == 'checkbox')
			{
				el.checked = newCheckValue;
				SelectParentRow(el);
			}
		}
	}
}
