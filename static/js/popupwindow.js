function docWidth() {
	return (typeof(window.innerWidth) != 'undefined') ? window.innerWidth : document.body.clientWidth;
}
function docHeight() {
	return (typeof(window.innerHeight) != 'undefined') ? window.innerHeight: document.body.clientHeight;
}
$(document).ready(function(){
	InitWindowSize();
	window.containerLeft = $("#popupContainer").offset().left + parseInt($("#popupContainer").css("paddingLeft"));
	$("div.sub_divider").each(function() {
		$(this).css("backgroundPosition", "-" + ($(this).position().left - window.containerLeft) + "px 0");
	});
	$("<div class='left_box'>&nbsp;</div>")
		.prependTo($("#popupContainer"))
		.css( {
			top: 0,
			left: - $("#popupContainer").offset().left
		});
});
function InitWindowSize() {
	var fixWidth = $("#popupContainer").outerWidth();
	var maxWidth = fixWidth - 20;
	var tablesInside = $("#popupContainer table").get();
	for(var i = 0, len = tablesInside.length; i < len; i++)
		if(maxWidth < $(tablesInside[i]).outerWidth())
			maxWidth = $(tablesInside[i]).outerWidth();
	fixWidth = maxWidth + 20;
	var 
		resX = 60 - (docWidth() - $("#popupContainer").outerWidth()),
		resY = 60 - (docHeight() - $("#popupContainer").outerHeight());
	
	$("#popupContainer").css("width", fixWidth + "px");
	
	window.resizeBy(
		60 - (docWidth() - $("#popupContainer").outerWidth()),
		60 - (docHeight() - $("#popupContainer").outerHeight())
	);
}