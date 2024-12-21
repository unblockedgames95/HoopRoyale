var TapResponder = pc.createScript('tapResponder');

TapResponder.attributes.add('linearVelocity', {
    title: 'Linear velocity',
    type: 'vec3',
    default: [0, 0, 0]
});

TapResponder.attributes.add('bindTo', {
    type: 'string',
    title: 'Bind to',
    enum: [
        { 'input': 'input' },
        { 'bot': 'bot' }
    ]
});

// initialize code called once per entity
TapResponder.prototype.initialize = function() {
    var bindTap = function () {
             this.app.on(this.bindTo + ':tap', this.tap.bind(this));
        }.bind(this),
        
        unbindTap = function () {
             this.app.off(this.bindTo + ':tap');
        }.bind(this);
    
    this.app.on('Round:start', bindTap);
    this.app.on('Round:end', unbindTap);
    this.app.on('Round:interrupt', unbindTap);
    
    this.direction = 1;
    
    this.entity.rigidbody.on('collisionstart', this.onCollisionStart.bind(this));
};

/* 
 * -1 - left side 
 *  1 - right side
 */
TapResponder.prototype.tap = function(xDirection) {
    if (Conf.GAME_MODE == Conf.GAME_MODES.SINGLE)
        xDirection = this.direction;
    
    if (this.app.timeScale)
        Controllers.soundController.play(Conf.SOUNDS.HOOP_JUMP);
        
    this.entity.rigidbody.linearVelocity = new pc.Vec3(xDirection * this.linearVelocity.x, 
                                                       this.linearVelocity.y, 
                                                       this.linearVelocity.z);
};

TapResponder.prototype.onCollisionStart = function(event) {
    if (event.other.name.indexOf('Wall') < 0)
        return;
    
    this.direction *= -1;
    
    if (Conf.GAME_MODE == Conf.GAME_MODES.SINGLE) {
        var linearVelocity = this.entity.rigidbody.linearVelocity.clone();
        
        linearVelocity.x = this.linearVelocity.x * this.direction;
        
        this.entity.rigidbody.linearVelocity = linearVelocity;
    }
};

