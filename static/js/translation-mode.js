jQuery.noConflict();
jQuery.fn.extend(
	{
		visible: function() {
			return this.css('visibility', 'visible');
		},
		invisible: function() {
			return this.css('visibility', 'hidden');
		}
	}
);
jQuery(window).load(
	function() { BuildTables(); }
);
function BuildTables()
{
	var parentCont = (window.showOneContext == true) ?
		jQuery("#content_table") :
		jQuery("#contexts_div");
		
	if(parentCont.length == 0)
		parentCont = jQuery(".results_value");
	if(parentCont.length == 0)
	{
		alert('Ошибка: не найден контейнер');
		return;
	}
	jQuery("p", parentCont).fadeTo("fast", 0.1);

	var pList = jQuery('p', parentCont).get();
	for(var pIdx = 0; pIdx < pList.length; pIdx++)
	{
		var
			curP = jQuery(pList[pIdx]),
			spansList = jQuery('span', curP).get(),
			table = null,
			tableRow = null,
			maxwidth = curP.width();

		for(var run = 0; run < spansList.length; run++)
		{
			var curSpan = jQuery(spansList[run]);
			if(table == null)
			{
				table = jQuery("<table>").appendTo(curP);
				tableRow = jQuery("<tr>").appendTo(table);
			}
			else
			{
				if(table.width() + curSpan.width() > maxwidth)
				{
					table = jQuery("<table>").appendTo(curP);
					tableRow = jQuery("<tr>").appendTo(table);
				}
			}
			curSpan.appendTo(
				jQuery("<td>").appendTo(tableRow)
			);
			curSpan.visible();
		}
	}
	jQuery("p", parentCont).fadeTo("slow", 1);
	
}
