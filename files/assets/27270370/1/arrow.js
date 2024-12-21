var Arrow = pc.createScript('arrow');

// initialize code called once per entity
Arrow.prototype.initialize = function() {
    this.arrowContainer = this.app.root.findByName('Player arrow container').clone();
    
    this.app.on('Round:enter', function (roundMode) {
        setTimeout(function () {
            this.arrowContainer.enabled = (roundMode == Conf.ROUND_MODE);
        }.bind(this), 50);
        
        this.enabled = (roundMode == Conf.ROUND_MODE);
    }.bind(this));
    
    this.app.on('Round:start', function () {
        this.arrowContainer.enabled = false;
        this.enabled = false;
    }.bind(this));
};

// update code called every frame
Arrow.prototype.update = function(dt) {
    this.pos = this.entity.getLocalPosition().clone();
    
    this.pos.y += 0.5;
    
    this.arrowContainer.setLocalPosition(this.pos);
};

// swap method called for script hot-reloading
// inherit your script state here
// Arrow.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/