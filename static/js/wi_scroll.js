var 
	pWIScroll = clsWIScroll.prototype;

function clsWIScroll( sTag, sUpAttrib, sDownAttrib, sLeftAttrib, sRightAttrib )
{
	this.arScrollObject = new Array( );

	this.sControlTag = sTag;
	this.sUpControlAttrib = ( sUpAttrib ? sUpAttrib : false );
	this.sDownControlAttrib = ( sDownAttrib ? sDownAttrib : false );
	this.sLeftControlAttrib = ( sLeftAttrib ? sLeftAttrib : false );
	this.sRightControlAttrib = ( sRightAttrib ? sRightAttrib : false );

	this.sActiveControlClass = '';
	this.sNormalControlClass = '';
	this.sDisabledControlClass = '';

	this.iScrollSpeed = 50;
	this.iScrollStep = 18;
}

pWIScroll.init = function( )
{
	var
		oControls = document.getElementsByTagName( this.sControlTag );
	
	if( oControls.length )
	{
		for( var i = 0; i < oControls.length; i ++ )
		{
			var
				sTmp;

			if( ( sTmp = oControls[ i ].getAttribute( this.sUpControlAttrib ) ) )
			{
				if( !this.arScrollObject[ sTmp ] )
					this.arScrollObject[ sTmp ] = new clsWIScrollObject( sTmp, this.iScrollSpeed, this.iScrollStep, this.sActiveControlClass, this.sNormalControlClass, this.sDisabledControlClass );

				this.arScrollObject[ sTmp ].initUpControl( oControls[ i ] );
			}

			if( ( sTmp = oControls[ i ].getAttribute( this.sDownControlAttrib ) ) )
			{
				if( !this.arScrollObject[ sTmp ] )
					this.arScrollObject[ sTmp ] = new clsWIScrollObject( sTmp, this.iScrollSpeed, this.iScrollStep, this.sActiveControlClass, this.sNormalControlClass, this.sDisabledControlClass );

				this.arScrollObject[ sTmp ].initDownControl( oControls[ i ] );
			}

			if( ( sTmp = oControls[ i ].getAttribute( this.sLeftControlAttrib ) ) )
			{
				if( !this.arScrollObject[ sTmp ] )
					this.arScrollObject[ sTmp ] = new clsWIScrollObject( sTmp, this.iScrollSpeed, this.iScrollStep, this.sActiveControlClass, this.sNormalControlClass, this.sDisabledControlClass );

				this.arScrollObject[ sTmp ].initLeftControl( oControls[ i ] );
			}

			if( ( sTmp = oControls[ i ].getAttribute( this.sRightControlAttrib ) ) )
			{
				if( !this.arScrollObject[ sTmp ] )
					this.arScrollObject[ sTmp ] = new clsWIScrollObject( sTmp, this.iScrollSpeed, this.iScrollStep, this.sActiveControlClass, this.sNormalControlClass, this.sDisabledControlClass );

				this.arScrollObject[ sTmp ].initRightControl( oControls[ i ] );
			}
		}
	}
	
}

var
	pWIScrollObject = clsWIScrollObject.prototype;

function clsWIScrollObject( sContainerID, iSpeed, iStep, sActClass, sNormClass, sDisClass )
{
	this.oContainer = document.getElementById( sContainerID );
	this.oUpControl = null;
	this.oDownControl = null;
	this.oLeftControl = null;
	this.oRightControl = null;

	this.isInitialized = false;

	this.sActiveControlClass = sActClass;
	this.sNormalControlClass = sNormClass;
	this.sDisabledControlClass = sDisClass;
	
		
	this.bChangeClasses = ( this.sActiveControlClass != "" || this.sNormalControlClass != "" || this.sDisabledControlClass != "" ? true : false );

	if( !this.oContainer )
	{
		alert( 'Error: can find no container object!' );
		return;
	}
	else
	{
		this.isInitialized = true;
	}

	this.iScrollSpeed = iSpeed;
	this.iScrollStep = iStep;

	this.oTimeout = null;
}

pWIScrollObject.initUpControl = function( oObject )
{
	WI_attachEvent( 'onclick', oObject, makeDelegate( this, this.cancelEvent ) );
	WI_attachEvent( 'onmousedown', oObject, makeDelegate( this, this.scrollUp ) );
	this.oUpControl = oObject;
	
	if( !this.oContainer.scrollTop && this.bChangeClasses && this.bChangeClasses )
		this.oUpControl.className = this.sDisabledControlClass;

	this.attachStopEvents( oObject );
}

pWIScrollObject.initDownControl = function( oObject )
{
	WI_attachEvent( 'onclick', oObject, makeDelegate( this, this.cancelEvent ) );
	WI_attachEvent( 'onmousedown', oObject, makeDelegate( this, this.scrollDown ) );
	this.oDownControl = oObject;

	if( this.oContainer.offsetHeight == this.oContainer.scrollHeight && this.bChangeClasses )
		this.oDownControl.className = this.sDisabledControlClass;
	
	this.attachStopEvents( oObject );
}

pWIScrollObject.initLeftControl = function( oObject )
{
	WI_attachEvent( 'onclick', oObject, makeDelegate( this, this.cancelEvent ) );
	WI_attachEvent( 'onmousedown', oObject, makeDelegate( this, this.scrollLeft ) );
	this.oLeftControl = oObject;

	if( !this.oContainer.scrollLeft && this.bChangeClasses )
		this.oLeftControl.className = this.sDisabledControlClass;
	
	this.attachStopEvents( oObject );
}

pWIScrollObject.initRightControl = function( oObject )
{
	WI_attachEvent( 'onclick', oObject, makeDelegate( this, this.cancelEvent ) );
	WI_attachEvent( 'onmousedown', oObject, makeDelegate( this, this.scrollRight ) );
	this.oRightControl = oObject;

	if( this.oContainer.offsetWidth == this.oContainer.scrollWidth && this.bChangeClasses )
		this.oRightControl.className = this.sDisabledControlClass;

	this.attachStopEvents( oObject );
}

pWIScrollObject.attachStopEvents = function( oObject )
{
	WI_attachEvent( 'onmouseup', oObject, makeDelegate( this, this.stopScroll ) );
	WI_attachEvent( 'onmouseout', oObject, makeDelegate( this, this.stopScroll ) );
}

pWIScrollObject.cancelEvent = function( )
{
	var
		oEvent = ( window.event ? window.event : WIEventHolder );

	WI_cancelEvent( oEvent );
}

pWIScrollObject.scrollUp = function( )
{
	if( !this.isInitialized )
	{
		alert( 'Error: scrolling container isn\'t initialized!' );
		return;
	}
	
	var
		oEvent = ( window.event ? window.event : WIEventHolder );

	if( oEvent.button > 1 )
		return false;
	
	this.oTimeout = setTimeout( makeDelegate( this, this._scrollUp ), this.iScrollSpeed );

	if( this.bChangeClasses && this.oUpControl.className.indexOf( this.sDisabledControlClass ) )
	{
		this.oUpControl.className = this.sActiveControlClass;
		this.oDownControl.className = this.sNormalControlClass;
	}
}

pWIScrollObject._scrollUp = function( )
{
	var
		iScrollTop = this.oContainer.scrollTop - this.iScrollStep;

	if( iScrollTop < 0 )
		iScrollTop = 0;

	this.oContainer.scrollTop = iScrollTop;

	if( iScrollTop )
		this.oTimeout = window.setTimeout( makeDelegate( this, this._scrollUp ), this.iScrollSpeed );
	else if( this.bChangeClasses )
		this.oUpControl.className = this.sDisabledControlClass;

}

pWIScrollObject.scrollDown = function( )
{
	if( !this.isInitialized )
	{
		alert( 'Error: scrolling container isn\'t initialized!' );
		return;
	}
	
	var
		oEvent = ( window.event ? window.event : WIEventHolder );

	if( oEvent.button > 1 )
		return false;

	this.oTimeout = setTimeout( makeDelegate( this, this._scrollDown ), this.iScrollSpeed );

	if( this.bChangeClasses && this.oDownControl.className.indexOf( this.sDisabledControlClass ) )
	{
		this.oDownControl.className = this.sActiveControlClass;
		this.oUpControl.className = this.sNormalControlClass;
	}
}

pWIScrollObject._scrollDown = function( )
{
	var
		iScrollTop = this.oContainer.scrollTop + this.iScrollStep;

	if( iScrollTop + this.oContainer.offsetHeight > this.oContainer.scrollHeight )
		iScrollTop = this.oContainer.scrollHeight - this.oContainer.offsetHeight;

	this.oContainer.scrollTop = iScrollTop;
	
	if( iScrollTop != this.oContainer.scrollHeight - this.oContainer.offsetHeight )
		this.oTimeout = window.setTimeout( makeDelegate( this, this._scrollDown ), this.iScrollSpeed );
	else if( this.bChangeClasses )
		this.oDownControl.className = this.sDisabledControlClass;
}

pWIScrollObject.scrollLeft = function( )
{
	if( !this.isInitialized )
	{
		alert( 'Error: scrolling container isn\'t initialized!' );
		return;
	}

	var
		oEvent = ( window.event ? window.event : WIEventHolder );

	if( oEvent.button > 1 )
		return false;

	this.oTimeout = setTimeout( makeDelegate( this, this._scrollLeft ), this.iScrollSpeed );

	if( this.bChangeClasses && this.oLeftControl.className.indexOf( this.sDisabledControlClass ) )
	{
		this.oLeftControl.className = this.sActiveControlClass;
		this.oRightControl.className = this.sNormalControlClass;
	}
}

pWIScrollObject._scrollLeft = function( )
{
	var
		iScrollLeft = this.oContainer.scrollLeft - this.iScrollStep;

	if( iScrollLeft < 0 )
		iScrollLeft = 0;

	this.oContainer.scrollLeft = iScrollLeft;

	if( iScrollLeft )
		this.oTimeout = window.setTimeout( makeDelegate( this, this._scrollLeft ), this.iScrollSpeed );
	else if( this.bChangeClasses )
		this.oLeftControl.className = this.sDisabledControlClass;
}

pWIScrollObject.scrollRight = function( )
{
	if( !this.isInitialized )
	{
		alert( 'Error: scrolling container isn\'t initialized!' );
		return;
	}

	var
		oEvent = ( window.event ? window.event : WIEventHolder );

	if( oEvent.button > 1 )
		return false;

	this.oTimeout = setTimeout( makeDelegate( this, this._scrollRight), this.iScrollSpeed );

	if( this.bChangeClasses && this.oRightControl.className.indexOf( this.sDisabledControlClass ) )
	{
		this.oRightControl.className = this.sActiveControlClass;
		this.oLeftControl.className = this.sNormalControlClass;
	}
}

pWIScrollObject._scrollRight = function( )
{
	var
		iScrollLeft = this.oContainer.scrollLeft + this.iScrollStep;

	if( iScrollLeft + this.oContainer.offsetWidth > this.oContainer.scrollWidth )
		iScrollLeft = this.oContainer.scrollWidth - this.oContainer.offsetWidth;

	this.oContainer.scrollLeft = iScrollLeft;

	if( iScrollLeft != this.oContainer.scrollWidth - this.oContainer.offsetWidth )
		this.oTimeout = window.setTimeout( makeDelegate( this, this._scrollRight ), this.iScrollSpeed );
	else if( this.bChangeClasses )
		this.oRightControl.className = this.sDisabledControlClass;
}

pWIScrollObject.stopScroll = function( )
{
	this.resetControlClassess( );
	window.clearTimeout( this.oTimeout );
}


pWIScrollObject.resetControlClassess = function( )
{
	if( this.oUpControl.className == this.sActiveControlClass )
		this.oUpControl.className = this.sNormalControlClass;

	if( this.oDownControl.className == this.sActiveControlClass )
		this.oDownControl.className = this.sNormalControlClass;

	if( this.oDownControl.className == this.sActiveControlClass )
		this.oDownControl.className = this.sNormalControlClass;

	if( this.oDownControl.className == this.sActiveControlClass )
		this.oDownControl.className = this.sNormalControlClass;
}
