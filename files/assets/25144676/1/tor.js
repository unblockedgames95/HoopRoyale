var Tor = pc.createScript('tor');

Tor.attributes.add('ball', {
    type: 'entity'
});

Tor.attributes.add("material", {
    type: "asset", 
    assetType: "material", 
    title: "Material"
});

Tor.prototype.MAX_ANGULAR_VELOCITY = 6;
Tor.prototype.MAX_DISTANCE_TO_SCORE = 0.045;
Tor.prototype.TRIGGER_LEAVE_DIST = 0.145;
Tor.prototype.FRAME_TIME = 0.016666667;

// initialize code called once per entity
Tor.prototype.initialize = function() {
    var linearFacror = this.entity.rigidbody.linearFactor,
        modelEnt = this.entity.findByName('Tor Model'),
        meshInstances = modelEnt.model.meshInstances,
        
        onCanvasResize = function (e) {
            var pos = this.entity.getPosition();
            
            if (pos.x > Conf.INIT_POS.x)
                this.entity.rigidbody.teleport(Conf.INIT_POS.x, pos.y, pos.z);
            else if (pos.x < -Conf.INIT_POS.x)
                this.entity.rigidbody.teleport(-Conf.INIT_POS.x, pos.y, pos.z);
        }.bind(this),
        
        activateTor = function () {
            this.entity.rigidbody.linearFactor = linearFacror;
            
            pc.app.graphicsDevice.on('resizecanvas', onCanvasResize);
        }.bind(this),
        
        deactivateTor = function () {
            this.entity.rigidbody.linearFactor = pc.Vec3.ZERO;
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;

            this.entity.setLocalRotation(new pc.Quat());
            
            pc.app.graphicsDevice.off('resizecanvas', onCanvasResize);
        }.bind(this);
    
    this.entity.rigidbody.linearFactor = pc.Vec3.ZERO;
    
    this.app.on('Round:start', activateTor);
    this.app.on('Round:exit', deactivateTor);
    
    // init torus model
    //this.node = new pc.GraphNode();
    //this.mesh = pc.createTorus(this.app.graphicsDevice, {tubeRadius: this.tubeRadius, 
    //                                                     ringRadius: this.ringRadius});
    
    //var torusMeshInstance = new pc.MeshInstance(this.node, this.mesh, material);
    
    //torusMeshInstance.castShadow = true;
    
    //this.model = new pc.Model();
    //this.model.graph = this.node;
    //this.model.meshInstances = [ torusMeshInstance ];
    
    //this.entity.model.model = this.model;

    meshInstances.forEach(function (mesh, index) {
        mesh.material = this.material.resource;
    }.bind(this));
    
    var body = this.entity.rigidbody.body;
    body.setCcdMotionThreshold(0.5);
    body.setCcdSweptSphereRadius(0.3);
    
    // Store the initial position and rotation for reseting
    this._origin = this.entity.getLocalPosition().clone();
    this._rotation = this.entity.getLocalRotation().clone();
    
    this.medianPos  = new pc.Vec3();
};

// update code called every frame
Tor.prototype.update = function(dt) {
    this.ballPos    = this.ball.getLocalPosition();
    this.pos        = this.entity.getLocalPosition();
    this.dist       = this.pos.distance(this.ballPos);
    this.prevPos    = this.prevPos ? this.prevPos : this.pos.clone();
    this.maxDist    = this.MAX_DISTANCE_TO_SCORE * dt / this.FRAME_TIME;
    
    this.medianPos.lerp(this.pos, this.prevPos, 0.5);
    
    this.medianDist = this.medianPos.distance(this.ballPos);
    
    if (!this.waitTriggerLeave && (this.dist < this.maxDist || this.medianDist < this.maxDist)) {
        this.waitTriggerLeave = true;
        
        this.app.fire('tor:score', this);
    
    } else if (this.dist > this.TRIGGER_LEAVE_DIST && 
               this.medianDist > this.TRIGGER_LEAVE_DIST && this.waitTriggerLeave) {
        this.waitTriggerLeave = false;
    }
    
    this.prevPos = this.pos.clone();
    
//     var angularVelocity = this.entity.rigidbody.angularVelocity,
//         direction = angularVelocity.z >= 0 ? 1 : -1;
    
//     // constraint max angular velocity
//     if (angularVelocity.z * direction > this.MAX_ANGULAR_VELOCITY)
//         this.entity.rigidbody.angularVelocity = new pc.Vec3(angularVelocity.x, 
//                                                             angularVelocity.y, 
//                                                             this.MAX_ANGULAR_VELOCITY * direction);
};

// Reset the tor to initial values
Tor.prototype.reset = function () {
    this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
    this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
    this.entity.rigidbody.teleport(this._origin, this._rotation);
};
