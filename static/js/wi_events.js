/*
 *	Event functions
 */

	// global variable, which contain event object
	var
		WIEventHolder = null;
	
	// function catch event and set WIEventHolder point to event objetc
	function WI_catchEvent( oEvent )
	{
		WIEventHolder = oEvent;

		WIEventHolder.srcElement = oEvent.target;
	}
	
	// function cancell event
	function WI_cancelEvent( oEvent )
	{
		if( isIE )
			oEvent.returnValue = false;
		else
			oEvent.preventDefault( );
	}

	// attach event, sEvent - event name (in IE format), oSrc - source object, oHandler - handler
	function WI_attachEvent( sEvent, oSrc, oHandler )
	{
		if( document.addEventListener )
		{
			try
			{
				oSrc.addEventListener( sEvent.substr( 2 ), WI_catchEvent, false );
				oSrc.addEventListener( sEvent.substr( 2 ), oHandler, false );
			}
			catch( e )
			{
				alert( e.message );
			}
		}
		else
		{
			try
			{
				oSrc.attachEvent( sEvent, oHandler );
			}
			catch( e )
			{
				alert( e.message );
			}
		}
	}

