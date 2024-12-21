var Input = pc.createScript('input');

Input.worldPos = new pc.Vec3();

// initialize code called once per entity
Input.prototype.initialize = function() {
    var self = this;

    // set up touch events if available
    if (this.app.touch) {
        this.app.touch.on("touchstart", this._onTouchStart, this);                
    }

    // set up mouse events
    this.app.mouse.on("mousedown", this._onMouseDown, this);
    
    this.app.keyboard.on("keydown", function (e) {
        if (e.key === pc.KEY_LEFT)
            this.app.fire('input:tap', -1);
        
        else if (e.key === pc.KEY_RIGHT)
            this.app.fire('input:tap', 1);
        
        e.event.preventDefault(); // Use original browser event to prevent browser action.
    }, this);
};

Input.prototype._onTap = function (x, y) {
    
    var side = x > (pc.app.graphicsDevice.width / pc.app.graphicsDevice.maxPixelRatio >> 1) ? 
        1 : -1;

    this.app.fire('input:tap', side);
};

Input.prototype._onTouchStart = function (e) {
    // respond to event
    var touch = e.changedTouches[0];
    this._onTap(touch.x, touch.y);

    // stop mouse events firing as well
    e.event.preventDefault();
};

Input.prototype._onMouseDown = function (e) {
    // respond to event
    this._onTap(e.x, e.y);
};