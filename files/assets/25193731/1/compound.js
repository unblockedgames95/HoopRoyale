var Compound = pc.createScript('compound');

// initialize code called once per entity
Compound.prototype.initialize = function() {
    var bodyShape = new Ammo.btCompoundShape();
    
    var children = this.entity.findByTag("compound-shape");

    children.forEach(function(child) {
        var childPosition   = child.getLocalPosition(),
            childRotation   = child.getLocalRotation(),
            shapeData       = child.collision.data,
            childShape;
        
        switch (child.collision.data.type) {
            case "sphere":
                childShape = new Ammo.btSphereShape(shapeData.radius);
                break;
            case "box":
                childShape = new Ammo.btBoxShape(new Ammo.btVector3(shapeData.halfExtents.x, 
                                                                    shapeData.halfExtents.y, 
                                                                    shapeData.halfExtents.z));
                break;
            default:
                throw new Error('Unknown shape');
        }
        
        var rotation = new Ammo.btQuaternion(childRotation.x,childRotation.y,childRotation.z,1);
        var position = new Ammo.btVector3(childPosition.x,childPosition.y,childPosition.z);
        bodyShape.addChildShape(new Ammo.btTransform(rotation, position), childShape);
        
        child.destroy();
    });
     
    var entityPosition = this.entity.getPosition();
    var position = new Ammo.btVector3(entityPosition.x, entityPosition.y, entityPosition.z);
    
    var state = new Ammo.btDefaultMotionState(new Ammo.btTransform(new Ammo.btQuaternion(0, 0, 0, 1), position));
    
    var fallInertia = new Ammo.btVector3(0, 0, 0);
    bodyShape.calculateLocalInertia(this.entity.rigidbody.mass, fallInertia);
    var rigidBodyCI = new Ammo.btRigidBodyConstructionInfo(this.entity.rigidbody.mass, state, bodyShape, fallInertia);
    
    this.rigidbody = new Ammo.btRigidBody(rigidBodyCI);
    this.rigidbody.setRestitution(this.entity.rigidbody.restitution);
    this.rigidbody.setFriction(this.entity.rigidbody.friction);
    this.rigidbody.setDamping(this.entity.rigidbody.linearDamping, this.entity.rigidbody.angularDamping);
    
    var linearFactor = this.entity.rigidbody.linearFactor;
    var angularFactor = this.entity.rigidbody.angularFactor;
    
    this.rigidbody.setLinearFactor(new Ammo.btVector3(linearFactor.x, linearFactor.y, linearFactor.z));
    this.rigidbody.setAngularFactor(new Ammo.btVector3(angularFactor.x, angularFactor.y, angularFactor.z));
    
    this.rigidbody.entity = this.entity;
    this.app.systems.rigidbody.dynamicsWorld.addRigidBody(this.rigidbody);
    this.entity.rigidbody.body = this.rigidbody;
    
    this.btTrans = new Ammo.btTransform();
};

// update code called every frame
Compound.prototype.update = function(dt) {
    this.rigidbody.getMotionState().getWorldTransform(this.btTrans);
    this.btPos = this.btTrans.getOrigin();
    this.btRot = this.btTrans.getRotation();
    this.entity.setRotation(new pc.Quat(this.btRot.x(),this.btRot.y(), this.btRot.z(), this.btRot.w()));
    this.entity.setPosition(this.btPos.x(), this.btPos.y(), this.btPos.z());
};