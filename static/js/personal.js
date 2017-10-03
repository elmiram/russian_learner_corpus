// JavaScripts for Customer Account Pages
var 
	isOpera = ( document.opera || ( document.attachEvent && document.addEventListener ) ? true : false ),
	mustBeFocused = null,
	updateEnabled = false;
	 
// Attaching all objects initialization on document load event  
try { 
	WI_attachEvent( 'onload', ( isOpera ? document : window ), GInit );  
}
catch( e )  
{ 
	//alert( e.message ); 
}
 

function GInit( ) {
	try 
	{
		oWMScroll = new clsWIScroll( 'a', 'upControl', 'downControl', 'leftControl', 'rightControl'  );
		oWMScroll.sNormalControlClass = 'normal';
		oWMScroll.sActiveControlClass = 'pressed';
		oWMScroll.sDisabledControlClass = 'disabled';
		oWMScroll.init( );
		
		var scrollBlock = document.getElementById('scroll');
		var anchor = document.getElementById('anchor');
		var rightBottom = document.getElementById('rightBottom');
		var widthScrollBlock = rightBottom.offsetLeft;
		var valueScroll =  anchor.offsetLeft - widthScrollBlock/2 + 50;
		scrollBlock.scrollLeft = valueScroll;
	}
	catch ( e )
	{
		//alert( e.message ); 
	}
} 

/*function setPressed ( tObject ) {
	if ( tObject ) tObject.className = 'pressed';
}
function setNormal ( tObject ) {
	if ( tObject ) tObject.className = '';
}*/


// Set enabled/disabled status for update quantity block on page load. If no JS support, enabled state will set by default.
function setUpdateStatus ( divId ) {
	var
		divEnabled = document.getElementById ( divId + '_on');
		divDisabled = document.getElementById ( divId + '_off');
		
	if ( divEnabled && divDisabled ) 
		if ( !updateEnabled ) {
			divEnabled.className = 'hide';
			divDisabled.className = '';
//			updateEnabled = true;
//			alert ( updateEnabled );
		}
}

// Changes enabled/disabled status for update quantity block
function changeUpdateStatus ( divId ) {
	
	var
		divEnabled = document.getElementById ( divId + '_on');
		divDisabled = document.getElementById ( divId + '_off');
	
		if ( divEnabled && divDisabled ) {
			divEnabled.className = '';
			divDisabled.className = 'hide';
		}
}

// Disables all inputs this a given name. Use it this "onload" event.
function disableInputs ( name ) {
	var allInputs = document.getElementsByName ( name );
	if ( allInputs )
		for ( var i=0; i < allInputs.length; i++ ) 
			allInputs[i].disabled = true;
}

// Selects the entire contents of input element then the user clicked on it. Use with "onclick" event.
function focusInput ( oInput ) {
	var word = arguments [1];
	if (oInput && !oInput.readOnly) {
		if ( !word || oInput.value == word )
			oInput.select ();
	}
}

function setStatus ( tObject ) {
	var
		unselectInput = null,
		oInput = tObject.childNodes[0];
	
	if ( mustBeFocused ) return;

	if( isOpera && tObject.tagName != 'LABEL' || !isOpera && tObject.tagName != 'INPUT' ) {
		return;
	}
	
	if ( !isOpera ) oInput = tObject;
	
	var allControls = document.getElementsByName( oInput.name );
	
	if( allControls.length > 1 )
	for ( var i=0; i<allControls.length; i++ ) 
	{
		var sClassName = allControls[i].parentNode.parentNode.className.split(' ');
		var j=0;
		while ( sClassName.length > 1 && j < sClassName.length) {
			if (sClassName[j] == 'selected') {
					unselectInput = i+1;
					sClassName[j] = '';
					break;
			}
			j++;
		}
		var baseClassName = sClassName.join(' ');
	}
	
	if ( unselectInput ) 
	{
		allControls[unselectInput-1].parentNode.parentNode.className = baseClassName;
		oInput.parentNode.parentNode.className = baseClassName + ' selected';
		// Deactivate the following input
		var folInput = allControls[unselectInput-1].parentNode;
		folInput = folInput.nextSibling;
		while ( folInput && folInput.tagName != 'INPUT' )
			folInput = folInput.nextSibling;
		
		if ( folInput && folInput.tagName == 'INPUT' )
			folInput.disabled = true;

	}
	else 
	{
		var sClassName = oInput.parentNode.parentNode.className.split(' ');
		var j=0;
		var isSelected = false;
		for (var j=0; j < sClassName.length; j++ )
			if ( sClassName[j] == 'selected' ) {
				isSelected = true; break;
			}
		
		if ( isSelected )
			oInput.parentNode.parentNode.className = 'choose';
		else 
			oInput.parentNode.parentNode.className = 'choose selected';
	}
	
	// Activate / deactivate the following input
	oInput = oInput.parentNode;
	oInput = oInput.nextSibling;
	while ( oInput && oInput.tagName != 'INPUT' ) { oInput = oInput.nextSibling; }

	if ( oInput && oInput.tagName == 'INPUT' ) {
		oInput.disabled = !oInput.disabled;
		if ( !oInput.disabled )
			oInput.focus( );
	}
}