var AdaptiveScale = pc.createScript('adaptiveScale');

AdaptiveScale.attributes.add('background', {
    title: 'background element',
    type: 'entity'
});

// initialize code called once per entity
AdaptiveScale.prototype.initialize = function() {
    var bgWidth = this.background.element.width,
        initScale = this.entity.getLocalScale().clone(),
        UIScreen = this.entity.root.findByName('UI').screen,
        newScale,
    
        onCanvasResize = function (e) {
            if (Utils.isLandscape()) {
                this.entity.setLocalScale(initScale);
                
                return;
            }
            
            newScale = (bgWidth * UIScreen.scale > pc.app.graphicsDevice.width) ? 
                pc.app.graphicsDevice.width / bgWidth / UIScreen.scale : 1;
            
            this.entity.setLocalScale(newScale, newScale, newScale);
        }.bind(this);
    
    pc.app.graphicsDevice.on('resizecanvas', onCanvasResize);
    
    onCanvasResize();
};