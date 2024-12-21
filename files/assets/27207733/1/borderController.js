var BorderController = pc.createScript('borderController');

// initialize code called once per entity
BorderController.prototype.initialize = function() {
    var cameraEnt = this.app.root.findByName('Camera'),
        cameraPos = cameraEnt.getPosition(),
        borderL = this.entity.findByName('Border l'),
        borderR = this.entity.findByName('Border r'),
        wallL = this.entity.findByName('Wall left'),
        wallR = this.entity.findByName('Wall right'),
        wallLPos = wallL.getPosition().clone(),
        wallRPos = wallR.getPosition().clone(),
        wallLHalfExtents = wallL.collision.halfExtents,
        wallRHalfExtents = wallR.collision.halfExtents,
        
        onCanvasResize = function (e) {
            if (!Utils.isLandscape()) {
                setTimeout(hideBorders, 0);
                
                return;
            }

            borderL.enabled = true;
            borderR.enabled = true;
            
            wallL.rigidbody.teleport(wallLPos);
            wallR.rigidbody.teleport(wallRPos);
        }.bind(this),
        
        activateBorders = function () {
            pc.app.graphicsDevice.on('resizecanvas', onCanvasResize);
            onCanvasResize();
        }.bind(this),
        
        deactivateBorders = function () {
            pc.app.graphicsDevice.off('resizecanvas', onCanvasResize);
            hideBorders();
        }.bind(this),
        
        hideBorders = function () {
            var worldLPos = cameraEnt.camera.screenToWorld(0, 0, cameraPos.z - wallLPos.z),
                worldRPos = cameraEnt.camera.screenToWorld(pc.app.graphicsDevice.width / pc.app.graphicsDevice.maxPixelRatio, 
                                                           0, cameraPos.z - wallRPos.z);
            
            borderL.enabled = false;
            borderR.enabled = false;
            
            wallL.rigidbody.teleport(worldLPos.x - wallLHalfExtents.y, wallLPos.y, wallLPos.z);
            wallR.rigidbody.teleport(worldRPos.x + wallRHalfExtents.y, wallRPos.y, wallRPos.z);
        };
    
    this.app.on('Round:enter', activateBorders);
    this.app.on('Round:exit', deactivateBorders);
};