var ChestCap = pc.createScript('chestCap');

// initialize code called once per entity
ChestCap.prototype.initialize = function() {
    this.MAX_ANGLE = 35;
    this.enabled = false;
};

ChestCap.prototype.open = function() {
    if (this.enabled)
        return;
    
    this.angle = 0;
    this.enabled = true;
    
    return new Promise(function (res, rej) {
        this.resolve = res;
    }.bind(this));
};

ChestCap.prototype.close = function() {
    this.enabled = false;
    this.angle = 0;
    this.updateAngle();
};

ChestCap.prototype.updateAngle = function() {
    this.entity.setLocalRotation(new pc.Quat().setFromEulerAngles(0, 0, this.angle));
};

// update code called every frame
ChestCap.prototype.update = function(dt) {
    if (this.angle < this.MAX_ANGLE) {
        this.angle++;
    } else {
        this.enabled = false;
        this.resolve();
    }
    
    this.updateAngle();
};