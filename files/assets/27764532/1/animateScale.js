var AnimateScale = pc.createScript('animateScale');

AnimateScale.attributes.add("offsetCurve", {type: "curve", title: "Offset Curve", curves: [ 'x', 'y', 'z' ]});
AnimateScale.attributes.add("duration", {type: "number", default: 3, title: "Duration (secs)"});
AnimateScale.attributes.add('loop', {
    title: 'Loop animation',
    type: 'boolean',
    default: false
});
AnimateScale.attributes.add('autoPlay', {
    title: 'Auto play',
    type: 'boolean',
    default: false
});

// initialize code called once per entity
AnimateScale.prototype.initialize = function() {
    // Store the original scale of the entity so we can offset from it
    this.startScale = this.entity.getLocalScale().clone();
    
    // Keep track of the current scale
    this.scale = new pc.Vec3();
    
    if (!this.autoPlay)
        this.enabled = false;
    else 
        this.play();
};

AnimateScale.prototype.play = function() {
    this.time = 0;
    this.enabled = true;
};

AnimateScale.prototype.update = function(dt) {
    this.time += dt;
    
    // Loop the animation forever
    if (this.loop && this.time > this.duration) {
        this.time -= this.duration;
    } else if (!this.loop && this.time > this.duration) {
        this.enabled = false;
    }
    
    // Calculate how far in time we are for the animation
    this.percent = this.time / this.duration;
    
    // Get curve values using current time relative to duration (percent)
    // The offsetCurve has 3 curves (x, y, z) so the returned value will be a set of 
    // 3 values
    this.curveValue = this.offsetCurve.value(this.percent);
    
    // Create our new position from the startScale and curveValue
    this.scale.copy(this.startScale);
    this.scale.x = this.curveValue[0];
    this.scale.y = this.curveValue[1];
    this.scale.z = this.curveValue[2];
    
    this.entity.setLocalScale(this.scale);
};
