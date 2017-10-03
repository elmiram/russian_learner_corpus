/*
 *	Common JS tools
 */

	// Define browser type
	var
		isOpera = ( document.opera || ( document.attachEvent && document.addEventListener ) ? true : false ),
		isIE = ( !isOpera && document.attachEvent ? true : false );

	// Function used for attach event handler if it is a class method ('this' in this case points to class object, not event object)
	function makeDelegate( oObject, oMethod ) 
	{
		var 
			f = function()
			{
				f.Method.call( f.Object );
			};

		f.Object = oObject;
		f.Method = oMethod;

		return f;
	}
	
	// function find parent node with corresponding tag
	function findParent( oNode, sTag )
	{
		if( !oNode.tagName )
			return null;

		if( oNode.tagName.toLowerCase( ) == sTag.toLowerCase( ) )
			return oNode;
		else
		{
			return ( oNode.parentNode ? findParent( oNode.parentNode, sTag ) : null );
		}
	}

	// function find parent node with corresponding tag and attribute
	function findParentWithAttrib( oNode, sTag, sAttrib )
	{
		if( !oNode.tagName )
			return null;

		if( oNode.tagName.toLowerCase( ) == sTag.toLowerCase( ) && oNode.getAttribute( sAttrib ) )
			return oNode;
		else
		{
			return ( oNode.parentNode ? findParentWithAttrib( oNode.parentNode, sTag, sAttrib ) : null );
		}
	}
