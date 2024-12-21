var TapParticles = pc.createScript('tapParticles');

// initialize code called once per entity
TapParticles.prototype.postInitialize = function() {
    var pSystem = this.entity.particlesystem,
        
        emit = function () {
            var playerTor = this.entity.root.findByName(Conf.TOR_PLAYER);
            
            this.entity.setLocalPosition(playerTor.getLocalPosition());
            
            pSystem.reset();
            pSystem.play();
        }.bind(this),
        
        bindTap = function () {
             this.app.on('input:tap', emit);
        }.bind(this),
        
        unbindTap = function () {
             this.app.off('input:tap');
        }.bind(this);
    
    this.app.on('Round:start', bindTap);
    this.app.on('Round:end', unbindTap);
    this.app.on('Round:interrupt', unbindTap);
};

