var BallArrow = pc.createScript('ballArrow');

// initialize code called once per entity
BallArrow.prototype.initialize = function() {
     var activateArrow = function (gameMode) {
            if (gameMode != Conf.TUTORIAL_MODE)
                return;
         
            this.entity.enabled = true;
            this.enabled = true;
        }.bind(this),
        
        deactivateArrow = function (gameMode) {
            this.entity.enabled = false;
            this.enabled = false;
        }.bind(this);
    
    this.app.on('Round:start', activateArrow);
    this.app.on('Round:end', deactivateArrow);
    this.app.on('Round:exit', deactivateArrow);
    
    this.playerTor = this.entity.root.findByName(Conf.TOR_PLAYER);
    this.ball = this.entity.root.findByName("Ball");
    this.quat = new pc.Quat();
};

// update code called every frame
BallArrow.prototype.update = function(dt) {
    this.torPos = this.playerTor.getLocalPosition().clone();
    this.ballPos = this.ball.getLocalPosition();
    this.dist = this.torPos.distance(this.ballPos);
    
    this.alpha = this.dist > 1 ? 1 : this.dist;
    this.alpha *= 0.75;
    
    this.torPos.sub(this.ballPos);
    this.phi = Math.atan(this.torPos.y / this.torPos.x) * 180 / Math.PI;
    
    if (this.torPos.x < 0)
        this.phi += 180;
    
    this.quat.setFromEulerAngles(0, 0, this.phi);
    
    this.entity.setLocalRotation(this.quat);
    
    // this doesn't work if material opacity is set to 1 WTF??? 
    this.entity.findByName('Ball arrow').model.material.setParameter("material_opacity", this.alpha);
};
