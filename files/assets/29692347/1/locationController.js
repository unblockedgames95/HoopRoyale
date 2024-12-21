var LocationController = pc.createScript('locationController');

// initialize code called once per entity
LocationController.prototype.initialize = function() {
    this.LOCATIONS_NUM = 4;
    this.HUD_COLORS = ['#F5907C', '#7D86F4', '#00A99D', '#DB428B'];
    
    this.location = this.entity.findByName('Location');
    this.bg1stTiles = this.location.findByName('Bg 1st plan').children;
    this.bg2ndTiles = this.location.findByName('Bg 2nd plan').children;
    this.tileMap1st = [2, 1, 3];
    this.tileMap2nd = [3, 2, 1];
    
    this.ingameHud = this.entity.findByName('Ingame HUD');
    this.hudBg = this.ingameHud.findByName('Backgound');
    this.scoreNumbers = this.ingameHud.findByTag('score-number');
    this.scorePlaces = this.ingameHud.findByTag('score-place');
    this.scorePoints = this.ingameHud.findByTag('score-point');
    this.timerBg = this.ingameHud.findByName('Timer Container').findByName('Background');
    this.timer = this.ingameHud.findByName('Game timer');
    
    this.overlayText = this.entity.findByName('Overlay HUD').findByName('Overlay text');
    
    this.updateLocation();
};

// update code called every frame
LocationController.prototype.updateLocation = function() {
    var newLocation = (((Utils.getStorageItem(Conf.STORAGE_KEYS.TOURNAMENT) || 1) - 1) % this.LOCATIONS_NUM) + 1,
        newColor = new pc.Color().fromString(this.HUD_COLORS[newLocation - 1]),
        
        setTexture = function (entity, textureName) {
            var texture = this.app.assets.find(textureName, 'texture'),
                material = entity.model.material,
                newName;

            if (!texture) {
                newName = textureName.replace(/_\d_/, '_1_');
                texture = this.app.assets.find(newName, 'texture');
            }
            
            if (!texture) {
                newName = textureName.replace(/2nd/, '1st');
                texture = this.app.assets.find(newName, 'texture');
                
                if (!texture) {
                    newName = newName.replace(/_\d_/, '_1_');
                    texture = this.app.assets.find(newName, 'texture');
                }
                
                material.emissiveIntensity = 0.6;
            } else {
                material.emissiveIntensity = 1;
            }
            
            if (material.diffuseMap)
                material.diffuseMap = texture.resource;

            if (material.emissiveMap)
                material.emissiveMap = texture.resource;

            if (material.opacityMap)
                material.opacityMap = texture.resource;

            material.update();
        }.bind(this);
    
    if (this.currentLocation == newLocation)
        return;
    
    this.currentLocation = newLocation;
    
    this.overlayText.element.outlineColor = newColor;
    this.timer.element.color = newColor;
    
    setTexture(this.location.findByName('Background'), 'sky_gradient_l' + this.currentLocation);
    setTexture(this.location.findByName('GroundModel'), 'field_top_l' + this.currentLocation);
    
    this.bg1stTiles.forEach(function(tile, index) {
        setTexture(tile, '1st_' + this.tileMap1st[index % this.tileMap1st.length]  + '_l' + this.currentLocation);
    }.bind(this));
    
    this.bg2ndTiles.forEach(function(tile, index) {
        setTexture(tile, '2nd_' + this.tileMap2nd[index % this.tileMap2nd.length]  + '_l' + this.currentLocation);
    }.bind(this));
    
    this.hudBg.element.texture = this.app.assets.find('hud_bg_l' + this.currentLocation, 'texture').resource;
    this.timerBg.element.texture = this.app.assets.find('timer_board_l' + this.currentLocation, 'texture').resource;
    
    this.scoreNumbers.forEach(function (scoreNumber, index) {
        scoreNumber.element.shadowColor = newColor;
    }.bind(this));
    
    this.scorePlaces.forEach(function (scorePlace, index) {
        scorePlace.element.texture = this.app.assets.find('score_point_place_l' + this.currentLocation, 'texture').resource;
    }.bind(this));
    
    this.scorePoints.forEach(function (scorePoint, index) {
        scorePoint.element.texture = this.app.assets.find('score_point_l' + this.currentLocation, 'texture').resource;
    }.bind(this));
};