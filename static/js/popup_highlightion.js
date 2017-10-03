Xoffset=5; Yoffset=5;
var nav,old,iex=(document.all);
var t,tstat=0;

document.onmousemove=getMouse;

function replacer(str, p1, offset, s)
{
return "";
}


function loadAttribsTable(lemmas,lexes,grams,flexes,trans)
{
	var result = "";
	var errs = "";
	if (grams[0]!="")
	{
		var arr = grams[0].match(/(DISCOURSE|FEF|DISCOURS|OFFICIAL|PARC|DISCUORSE|DICOURSE|CONSRT|WORD|CONSRTR|LACK|CONNECTOR|COMPARLEX|REF_CLAUSE|LINK|DISOURSE|CONSTR|DISCORSE|PHRASE|VOICE|REF|AGR|DERIVE|CAUS|INTENSE|GOV|WO|LEX|WORD|TAUTO|COLOQ|COUSE|COLLOQ|DSCOURSE|CIT|INTENS|TENSE|CONVERB|SOLLOQ|DISCCOURSE|TYPO|PHRAZE|CONTAM|COMP|STYLL|INTENCE|DISOCOURSE|STYL|LEC|COORD|CONTR|AUX|DISCOUSE|CAUSE|DERIV|SENT_ARG|REL_CLAUSE|COMPAR|CONCORD|METON|TAUOT|DIS_COORD|NMZ|CONSTR|CONTSR|PARON|TOPIC|PRON|LES|LOGIC|OFFFICIAL|ARG|LEX|ASP|INFL|PREP)/g);
		if (arr != null)
			{errs = arr.join(',');}
}

	result='<table border=0 cellpadding=0 cellspacing=0 width=10><tr><td height=20 width=20 class="popup_lt_td"><img src="images/hghlt_lt.png"  class="popup_img"></td><td height=20 class="popup_top_td"><img width=100% height=20 src="images/hghlt_border_top.png" height=20  class="popup_img"></td><td height=20 width=20 class="popup_rt_td"><img  id="popup_right"  src="images/hghlt_rt.png" class="popup_img"></td></tr><tr><td class="popup_left_td"><img width=20 height=100% src="images/hghlt_border_left.png" class="popup_img" id="hghlt_left"></td>';
	result += "<td class='popup_value' bgcolor=\"#FFFFFF\">";
	if (errs != "")
	{
	result += "<nobr><b style='color:#F6AF0A'>" + errs + "</b></nobr><br>";
}
	for (var i=0; i<lemmas.length; i++)
	{
		if (i>0)
		{
			result+="<hr noshade>";
		}
		result += "<nobr><b>"+lemmas[i]+"</b> ("+lexes[i]+")</nobr>"+"&nbsp;";
		if (grams[i]!="")
		{
			var s = String(grams[i]).replace(/,(DISCOURSE|FEF|DISCOURS|OFFICIAL|PARC|DISCUORSE|DICOURSE|CONSRT|WORD|CONSRTR|LACK|CONNECTOR|COMPARLEX|REF_CLAUSE|LINK|DISOURSE|CONSTR|DISCORSE|PHRASE|VOICE|REF|AGR|DERIVE|CAUS|INTENSE|GOV|WO|LEX|WORD|TAUTO|COLOQ|COUSE|COLLOQ|DSCOURSE|CIT|INTENS|TENSE|CONVERB|SOLLOQ|DISCCOURSE|TYPO|PHRAZE|CONTAM|COMP|STYLL|INTENCE|DISOCOURSE|STYL|LEC|COORD|CONTR|AUX|DISCOUSE|CAUSE|DERIV|SENT_ARG|REL_CLAUSE|COMPAR|CONCORD|METON|TAUOT|DIS_COORD|NMZ|CONSTR|CONTSR|PARON|TOPIC|PRON|LES|LOGIC|OFFFICIAL|ARG|LEX|ASP|INFL|PREP)/g, replacer);

		result += "<br><nobr>"+String(s).replace(/gen,dat/,"gen\/dat");+"&nbsp; "+flexes[i]+"</nobr>";
		}
		if (trans[i]!="")
			result += "<br><nobr>"+trans[i]+"</nobr>";
	}
	result +="</td>";
	result+='<td class="popup_right_td"><img width=20 src="images/hghlt_border_right.png" id="hghlt_right" class="popup_img"></td></tr><tr><td height=20  width=20  class="popup_lb_td"><img src="images/hghlt_lb.png" class="popup_img"></td><td height=20 class="popup_bottom_td"><img width=100% height=20 src="images/hghlt_border_bottom.png"  class="popup_img" id="popup_bottom"></td><td height=20  width=20 class="popup_rb_td"><img src="images/hghlt_rb.png" class="popup_img"></td></tr></table>';

	return result;
}

function getMouse(e)
{

	var x_pos = (!window.event) ? e.pageX+Xoffset : window.event.x+document.body.parentElement.scrollLeft+Xoffset;	  
	var y_pos = (!window.event) ? e.pageY+Yoffset : window.event.y+document.body.parentElement.scrollTop+Yoffset;

	var w = document.body.scrollWidth-document.getElementById('dek').scrollWidth-40-1;
	var h =document.body.scrollHeight-document.getElementById('dek').scrollHeight-50;

	var i = 0

	if (x_pos >w)
	{
		x = w;
		i++;
	}
	else
		x = x_pos;

	if (y_pos > h)
	{
		y = h;
		i++;
	}
	else
		y = y_pos;

	if (i==2)
	{
		x = x_pos-document.getElementById('dek').scrollWidth-20;
	}

	document.getElementById('dek').style.left = x;
	document.getElementById('dek').style.top = y;
}

function kill(){
	if (tstat==0)
	{
		t = setTimeout("setHidden()",100);
		tstat = 1;
	}
}

function setHidden()
{
	document.getElementById('dek').style.visibility="hidden";
	clearTimeout(t);
}

function popup(obj, lemmas, lexes, grams, flexes, trans)
{
	kill();
	if (tstat == 1)
	{
		clearTimeout(t);
		tstat=0;
	}

	if (lemmas.length>0 || grams.length>0 || flexes.length>0 || lexes.length>0)
	{
		var content = loadAttribsTable(lemmas,lexes,grams,flexes,trans);

		if (document.getElementById('dek').scrollHeight)
		{
			document.getElementById('dek').innerHTML = content;
			document.getElementById('hghlt_left').style.height = document.getElementById('dek').scrollHeight - 40;
			document.getElementById('hghlt_right').style.height = document.getElementById('dek').scrollHeight - 40;
			document.getElementById('dek').style.visibility = "visible";
		}
	}
	else
	{
		kill();
	}
	obj.onmouseout = kill;
}