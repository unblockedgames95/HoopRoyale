var AnimateRotation = pc.createScript('animateRotation');

AnimateRotation.attributes.add('axle', {
    type: 'string',
    title: 'Rotation axle',
    enum: [
        { 'x': 'x' },
        { 'y': 'y' },
        { 'z': 'z' }
    ]
});

// initialize code called once per entity
AnimateRotation.prototype.initialize = function() {
    this.angles = { x: 0,
                    y: 0,
                    z: 0 };
};

// update code called every frame
AnimateRotation.prototype.update = function(dt) {    
    this.angles[this.axle] = (this.angles[this.axle] + 1) % 360;
    
    this.entity.setLocalRotation(new pc.Quat().setFromEulerAngles(this.angles.x, this.angles.y, this.angles.z));
};
