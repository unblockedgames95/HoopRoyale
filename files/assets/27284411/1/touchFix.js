var TouchFix = pc.createScript('touchFix');

// initialize code called once per entity
TouchFix.prototype.initialize = function() {
    // Only register touch events if the device supports touch
    var touch = this.app.touch;
    if (touch) {
        touch.on(pc.EVENT_TOUCHEND, function(event) {
            // This prevents that a mouse click event will be executed after a touch event.
            event.event.preventDefault();
        });
    }
};