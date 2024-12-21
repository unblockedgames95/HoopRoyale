var TutorialButton = pc.createScript('tutorialButton');

// initialize code called once per entity
TutorialButton.prototype.initialize = function() {
    var resetIdleTime = function () {
            this.idleTime = this.entity.name.indexOf('Left') >= 0 ? 1.5 : 0;
        }.bind(this),
    
        tap = function (xDirection) {
            if ((xDirection < 0 && this.entity.name.indexOf('Left') >= 0) ||
                (xDirection > 0 && this.entity.name.indexOf('Right') >= 0))
                this.entity.script.animateScale.play();
            
            resetIdleTime();
        }.bind(this),
        
        bindTap = function (roundMode) {
            if (roundMode != Conf.TUTORIAL_MODE)
                return;
            
            this.app.on('input:tap', tap.bind(this));
            this.enabled = true;
        }.bind(this),
        
        unbindTap = function (roundMode) {
            if (roundMode != Conf.TUTORIAL_MODE)
                return;
            
            this.app.off('input:tap');
            this.enabled = false;
        }.bind(this);
    
    resetIdleTime();
    
    this.enabled = false;
    
    this.app.on('Round:start', bindTap);
    this.app.on('Round:end', unbindTap);
};

TutorialButton.prototype.update = function(dt) {
    this.idleTime += dt;
    
    if (this.idleTime >= 3) {
        this.entity.script.animateScale.play();
        this.idleTime = 0;
    }
};