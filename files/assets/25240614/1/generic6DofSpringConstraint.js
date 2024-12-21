var Generic6DofSpringConstraint = pc.createScript('generic6DofSpringConstraint');

Generic6DofSpringConstraint.attributes.add('linearLowerLimit', {
    title: 'Linear lower limit',
    description: 'Lower linear constraint in the local space of this entity.',
    type: 'vec3',
    default: [0, 0, 0]
});
Generic6DofSpringConstraint.attributes.add('linearUpperLimit', {
    title: 'Linear upper limit',
    description: 'Upper linear constraint in the local space of this entity.',
    type: 'vec3',
    default: [0, 0, 0]
});

Generic6DofSpringConstraint.attributes.add('angularLowerLimit', {
    title: 'Angular lower limit',
    description: 'Lower angular constraint in the local space of this entity.',
    type: 'vec3',
    default: [0, 0, 0]
});
Generic6DofSpringConstraint.attributes.add('angularUpperLimit', {
    title: 'Angular upper limit',
    description: 'Upper angular constraint in the local space of this entity.',
    type: 'vec3',
    default: [0, 0, 0]
});

Generic6DofSpringConstraint.attributes.add('enableCollision', {
    title: 'Enable Collision',
    description: 'Enable collision between linked rigid bodies.',
    type: 'boolean',
    default: true
});

// initialize code called once per entity
Generic6DofSpringConstraint.prototype.initialize = function() {
    this.entity.on('Constraints:set', this.setConstraints.bind(this));
    this.entity.on('Constraints:destroy', this.destroyConstraints.bind(this));
    
    this.setConstraints();
};

Generic6DofSpringConstraint.prototype.setConstraints = function() {
    var v1 = new pc.Vec3(),
        v2 = new pc.Vec3(),
        q = new pc.Quat(),
        m = new pc.Mat4(),
        axisA = new pc.Vec3(0, 0, 0),
        bodyA = this.entity.rigidbody.body,
        pivotA = new Ammo.btVector3(0, 0, 0);

    Utils.getOrthogonalVectors(axisA, v1, v2);
    m.set([
        axisA.x, axisA.y, axisA.z, 0,
        v1.x, v1.y, v1.z, 0,
        v2.x, v2.y, v2.z, 0,
        0, 0, 0, 1
    ]);
    q.setFromMat4(m);

    var quatA = new Ammo.btQuaternion(q.x, q.y, q.z, q.w);
    var frameA = new Ammo.btTransform(quatA, pivotA);
    frameA.setOrigin(pivotA);
    
    this.constraint = new Ammo.btGeneric6DofSpringConstraint(bodyA, frameA);
    
    this.constraint.setLinearLowerLimit(new Ammo.btVector3(this.linearLowerLimit.x, 
                                                           this.linearLowerLimit.y, 
                                                           this.linearLowerLimit.z));
    
    this.constraint.setLinearUpperLimit(new Ammo.btVector3(this.linearUpperLimit.x, 
                                                           this.linearUpperLimit.y, 
                                                           this.linearUpperLimit.z));
    
    this.constraint.setAngularLowerLimit(new Ammo.btVector3(this.angularLowerLimit.x, 
                                                            this.angularLowerLimit.y, 
                                                            this.angularLowerLimit.z));
    
    this.constraint.setAngularUpperLimit(new Ammo.btVector3(this.angularUpperLimit.x, 
                                                            this.angularUpperLimit.y, 
                                                            this.angularUpperLimit.z));
    
    Ammo.destroy(frameA);
    Ammo.destroy(quatA);
    Ammo.destroy(pivotA);

    // Enable spring behavior
    // for (var i = 0; i < 3; ++i) {
    //     this.constraint.enableSpring(i, true);
    //     this.constraint.setStiffness(i, 35.0);
    //     this.constraint.setDamping(i, 1.0);
    //     this.constraint.setEquilibriumPoint(i, 0);
    // }
    
    var dynamicsWorld = this.app.systems.rigidbody.dynamicsWorld;
    dynamicsWorld.addConstraint(this.constraint, !this.enableCollision);

    this.entity.rigidbody.activate();
};

Generic6DofSpringConstraint.prototype.destroyConstraints = function() {
    if (!this.constraint)
        return;

    var dynamicsWorld = this.app.systems.rigidbody.dynamicsWorld;
    dynamicsWorld.removeConstraint(this.constraint);
    Ammo.destroy(this.constraint);
    this.constraint = null;
};
