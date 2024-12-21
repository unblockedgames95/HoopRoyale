var Ball = pc.createScript('ball');

// initialize code called once per entity
Ball.prototype.initialize = function() {
    var positions = [new pc.Vec3(0, 0.5, 0),
                     new pc.Vec3(-0.9, 1.6, 0),
                     new pc.Vec3(0.9, 1.6, 0),
                     new pc.Vec3(0.9, -0.6, 0),
                     new pc.Vec3(-0.9, -0.6, 0)],
        currentPosIndex = 0,
        pSystemContainer = this.entity.findByName('P system container'),
        pSystems = this.entity.findByTag('particle-system');
    
    this.app.on('Round:enter', function () {
        currentPosIndex = 0;
        
        this.entity.enabled = true;
        
        this.teleport(positions[currentPosIndex]);
    }.bind(this));
    
    this.app.on('Round:exit', function () {
        this.entity.enabled = false;
    }.bind(this));
    
    this.app.on('Ball:teleport', function () {
        var newPosIndex = Utils.getRandomIndex(positions);
        
        currentPosIndex = (newPosIndex == currentPosIndex) ? 
            (newPosIndex + 1) % (positions.length - 1) :
            newPosIndex;
        
        this.teleport(positions[currentPosIndex]);
        
        Controllers.soundController.play(Conf.SOUNDS.BALL_DISAPPEAR);
    }.bind(this));
    
    this.app.on('tor:score', function (event) {
        pSystems.forEach(function (pSystem, index) {
            var quat = new pc.Quat(),
                angle = Math.round(Math.random() * 180);
            
            quat.setFromEulerAngles(0, 0, angle);
            
            pSystemContainer.setLocalRotation(quat);
            
            pSystem.particlesystem.reset();
            pSystem.particlesystem.play();
        }.bind(this));
    }.bind(this));
};

Ball.prototype.teleport = function (position) {
    var bouncePosition = position.clone();
    
    bouncePosition.y += 0.3;
    
    this.entity.fire('Constraints:destroy');
    this.entity.rigidbody.teleport(position);
    this.entity.fire('Constraints:set');
    
    this.entity.rigidbody.teleport(bouncePosition);
};
