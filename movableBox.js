/*
 * MovableBox
 *
 * Author: Carlos Eugenio Torres
 * Version: 2.0
 * Date: 22-01-2010
 *
 * Multibrowser support.
 */

var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _oldZIndex = 0;
var _dragElement = null;
var _reg = new RegExp('([0-9]*)px', 'i');
var _debug = null;

/*
 * MovableBox class
 */
var MovableBox = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    id: '',
    content: '',
    element: null,
    backColor: '#000000',
    
    init: function(boxId, boxContent, boxTop, boxLeft, boxWidth, boxHeight, boxBackColor, debugDisplayObject) 
    {
        this.element = MovableBox.createElement(boxId, boxContent, boxTop, boxLeft, boxWidth, boxHeight, boxBackColor);
		_debug = document.getElementById(debugDisplayObject);
		this.element.onmousedown = MovableBox.onMouseDownEvent;
    },
    
    createElement: function(boxId, boxContent, boxTop, boxLeft, boxWidth, boxHeight, boxBackColor)
    {
        var el = document.createElement('div');
		el.id = boxId;
        el.style.top = boxTop + 'px';
        el.style.left = boxLeft + 'px';
        el.style.width = boxWidth + 'px';
        el.style.height = boxHeight + 'px';
        el.innerHTML = boxContent;
        el.style.position = 'absolute';
        el.style.cursor = 'move';
        el.style.backgroundColor = boxBackColor;
		el.style.zIndex = 5;
        this.top = el.style.top;
        this.left = el.style.left;
        this.width = el.style.width;
        this.height = el.style.height;
        this.id = el.id;
        this.content = el.innerHTML;
        this.backColor = el.style.backgroundColor;
        return el;
    },
    
    onMouseDownEvent: function(e)
    {
		if (e == null) e = window.event; 
		
		_dragElement = e.target ? e.target : e.srcElement;
		
		if ((e.button == 1 && window.event != null) || e.button == 0)
		{
			_startX = e.clientX;
			_startY = e.clientY;
			
			_offsetX = parseInt(_reg.exec(_dragElement.style.left));
			_offsetY = parseInt(_reg.exec(_dragElement.style.top));
			
			_oldZIndex = _dragElement.style.zIndex;
			_dragElement.style.zIndex = 10000;
			
			document.onmouseup = MovableBox.onMouseUpEvent;
			document.onmousemove = MovableBox.onMouseMoveEvent;

			// prevent selection in IE
			document.body.focus();
			document.onselectstart = function () { return false; };
			_dragElement.onselectstart = function () { return false; };
			_dragElement.ondragstart = function() { return false; };

			if (_debug)
			{
				_debug.innerHTML = 'mouse down';
			}

			return false;
		}
    },
    
    onMouseUpEvent: function(e)
    {
		if (_dragElement != null)
		{
			_dragElement.style.zIndex = _oldZIndex;
			document.onmouseup = null;
			document.onmousemove = null;
			document.onselectstart = null;
			_dragElement.ondragstart = null;
			_dragElement = null;

			if (_debug)
			{
				_debug.innerHTML = 'mouse up';
			}
		}
    },
    
    onMouseMoveEvent: function(e)
    {
		if (_dragElement != null)
		{
			if (e == null) var e = window.event; 
			_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px'; 
			_dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px'; 

			if (_debug)
			{
				_debug.innerHTML = '[X,Y] = ' + '[' + _dragElement.style.left + ',' + _dragElement.style.top + ']';
			}
		}
    },   
    
    getTop: function()
    {
        return this.element.style.top;
    },
    
    getLeft: function()
    {
        return this.element.style.left;
    }
 
 };


/*
 * MovableBoxTable class
 * A container for MovableBox objects
 */
function MovableBoxTable()
{
	this.boxes = [];
}
MovableBoxTable.prototype.addBox = function(box)
{
	this.boxes.push(box);
}
MovableBoxTable.prototype.showAllBoxes = function()
{
	for (i = 0; i < this.boxes.length; i++)
	{
		var box = this.boxes[i];
		document.body.appendChild(box.element);
		box.element.style.visibility = 'visible';
	}
}
MovableBoxTable.prototype.showBox = function(boxId)
{
	var box = this.getBox(boxId);
	if (box)
	{
		document.body.appendChild(box.element);
		box.element.style.visibility = 'visible';
	}
}
MovableBoxTable.prototype.getBox = function(boxId)
{
	for (i = 0; i < this.boxes.length; i++)
	{
		var box = this.boxes[i];
		if (box.id == boxId)
		{
			return box;
			break;
		}
	}
}