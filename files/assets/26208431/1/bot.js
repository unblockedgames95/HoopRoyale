var Bot = pc.createScript('bot');

Bot.attributes.add('ball', {
    type: 'entity'
});

// initialize code called once per entity
Bot.prototype.initialize = function() {
    this.TAP_INTERVAL = 400;
    this.MAX_DEVIATION = 0.003;
    this.timeElapsed = 0;
    this.currentTapInterval = this.TAP_INTERVAL;
    this.enabled = false;
    this.ballRelPos = new pc.Vec3();
    this.forcedVelocity = new pc.Vec3();
    this.freeVelocity = new pc.Vec3();
    
    var unhold = function (e) {
            if (this.enabled)
                return;
            
            setTimeout(this.resetTapTimeout.bind(this), 200);
        };
    
    this.entity.rigidbody.on('collisionstart', unhold.bind(this));
    
    this.app.on('tor:score', function (e) {
        if (e.entity == this.entity)
            unhold.bind(this);
    });
    
    this.app.on('Round:start', function () {
        this.resetTapTimeout();
    }.bind(this));
};

Bot.prototype.emitTap = function(xDirection) {
    xDirection = xDirection || (Math.round(Math.random()) || -1);
    
    this.app.fire('bot:tap', xDirection);
};

Bot.prototype.getDeviation = function (vel) {
    this.dev_t      = this.ballRelPos.x / vel.x * this.xDirection;
    this.dev_torY1  = vel.y * this.dev_t + this.app.systems.rigidbody.gravity.y * this.entity.rigidbody.linearFactor.y * 
                        Math.pow(this.dev_t, 2) / 2;

    return Math.abs(this.ballRelPos.y - this.dev_torY1);
};

// update code called every frame
Bot.prototype.update = function(dt) {
    this.position = this.entity.getLocalPosition();
    this.ballPosition = this.ball.getLocalPosition();
        
    this.ballRelPos.sub2(this.ballPosition, this.position);
        
    this.xDirection = this.ballRelPos.x > 0 ? 1 : -1;
        
    this.forcedVelocity.mul2(this.entity.script.tapResponder.linearVelocity, this.entity.rigidbody.linearFactor);
    this.freeVelocity.mul2(this.entity.rigidbody.linearVelocity, this.entity.rigidbody.linearFactor);
    
    this.forcedDeviation = this.getDeviation(this.forcedVelocity);
    this.reeDeviation = this.getDeviation(this.freeVelocity);
    
    this.timeElapsed += dt * 1000;
    
    if (this.freeDeviation < this.MAX_DEVIATION) {
        this.enabled = false;
        
        //console.log("freeDeviation: " + freeDeviation);
    } else if (this.forcedDeviation < this.MAX_DEVIATION) {
        this.emitTap(this.xDirection);
        this.enabled = false;
        
        //console.log("forcedDeviation: " + forcedDeviation);
    } else if (this.timeElapsed >= this.currentTapInterval) {
        if (this.position.y < this.ballPosition.y * 1.5)
            this.emitTap(this.xDirection);
        
        this.resetTapTimeout();
        
        //console.log("tap");
    }
};

Bot.prototype.resetTapTimeout = function() {
    this.currentTapInterval = this.TAP_INTERVAL + Math.random() * 200;
    this.timeElapsed = 0;
    this.enabled = true;
    
    //console.log("unhold");
};
