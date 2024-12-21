var Adaptive = pc.createScript('adaptive');

// initialize code called once per entity
Adaptive.prototype.initialize = function() {
    var MARGIN = 15,
        initPos = this.entity.getLocalPosition().clone(),
        UIScreen = this.entity.root.findByName('UI').screen,
    
        onCanvasResize = function (e) {
            if (Utils.isLandscape()) {
                this.entity.setLocalPosition(initPos);
                
                return;
            }
            
            this.entity.setLocalPosition(pc.app.graphicsDevice.width / 2 / UIScreen.scale - MARGIN, 
                                    initPos.y, initPos.z);
        }.bind(this);
    
    pc.app.graphicsDevice.on('resizecanvas', onCanvasResize);
    
    onCanvasResize();
};