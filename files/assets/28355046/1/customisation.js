var Customisation = pc.createScript('customisation');

Customisation.prototype.initSkins = function() {
    var closeButton = this.entity.findByName('Close button'),
        hoopsTab = this.entity.findByName('Hoop button'),
        ballsTab = this.entity.findByName('Ball button'),
        
        onCellSelected = function (index) {
            var skin = this.skinController.getSkinByIndex(index, this.activeTab),
                activeTextures = Utils.getStorageItem(Conf.STORAGE_KEYS.ACTIVE_TEXTURES) || {},
                newTexture = skin.getTexture();
            
            if (this.skinController.isLocked(skin))
                return;
            
            Controllers.soundController.play(Conf.SOUNDS.APPLY_SKIN);
            
            updateTexture(this.getTargetModel(), newTexture);
            
            activeTextures[this.activeTab] = newTexture.id;
            
            Utils.setStorageItem(Conf.STORAGE_KEYS.ACTIVE_TEXTURES, activeTextures);
            
            this.setSelectedSkin(index);
        }.bind(this),
        
        updateTexture = function (targetModel, newTexture) {
            var material = targetModel.model.meshInstances[0].material,
                map = newTexture.resource;
            
            material.diffuseMap = map;
            material.emissiveMap = map;
            material.update();
            
            this.currentTextures[targetModel.name] = newTexture;
        }.bind(this),
        
        loadTexture = function (objectType) {
            var activeTextures = Utils.getStorageItem(Conf.STORAGE_KEYS.ACTIVE_TEXTURES) || {},
                textureId = activeTextures[objectType],
                texture = this.app.assets.get(textureId);
            
            if (!texture) {
                activeTextures[objectType] = undefined;
                Utils.setStorageItem(Conf.STORAGE_KEYS.ACTIVE_TEXTURES, activeTextures);
            }
            
            return texture;
        }.bind(this),
        
        onMouseUp = function (event) {
            var newPageFloat,
                decimal,
                newPage;
            
            if (this.app.touch) {
                this.app.touch.off('touchend', onMouseUp);
                this.app.touch.off('touchmove', onMouseMove);
            }
            
            this.app.mouse.off('mouseup', onMouseUp);
            this.app.mouse.off('mousemove', onMouseMove);
            
            setTimeout(function () {this.skinDrag = false;}.bind(this), 0);
            
            newPageFloat = Math.abs(this.skinGroups.getLocalPosition().x) / this.PAGE_INTERVAL_X;
            decimal = (newPageFloat % 1).toFixed(1);
            newPage = (decimal >= this.SLIDE_SENSITIVITY && newPageFloat > this.activePageIndex) ||
                (decimal >= (1 - this.SLIDE_SENSITIVITY) && newPageFloat < this.activePageIndex) ?
                    Math.ceil(newPageFloat) : Math.floor(newPageFloat);
            
            if (newPage != this.activePageIndex)
                Controllers.soundController.play(Conf.SOUNDS.POPUP_SWIPE);
            
            this.setPage(newPage);
        }.bind(this),
    
        onMouseMove = function (event) {
            var maxX = 0,
                minX = -1 * (this.getNumPages() - 1) * this.PAGE_INTERVAL_X,
                localPos = this.skinGroups.getLocalPosition(),
                clientX = this.app.touch ? event.touches[0].x : event.x,
                dx = clientX - this.touchX0;
            
            this.skinDrag = true;
            
            localPos.x = Math.round(this.skinGoupX0 + dx);
            
            if (localPos.x > maxX)
                localPos.x = maxX;
            else if (localPos.x < minX)
                localPos.x = minX;
            
            this.skinGroups.setLocalPosition(localPos);
        }.bind(this),
        
        onMouseDown = function (event) {
            event.stopPropagation();

            this.touchX0 = this.app.touch ? event.touches[0].clientX : event.x;
            this.skinGoupX0 = this.skinGroups.getLocalPosition().x;
            
            if (this.app.touch) {
                this.app.touch.on('touchend', onMouseUp);
                this.app.touch.on('touchmove', onMouseMove);
            }
            
            this.app.mouse.on('mouseup', onMouseUp);
            this.app.mouse.on('mousemove', onMouseMove);
        }.bind(this);
    
    this.INACTIVE_TAB_SCALE = new pc.Vec3(0.75, 0.75, 1);
    this.PAGE_INTERVAL_X = 410;
    this.SLIDE_SENSITIVITY = 0.1;
    this.ANIMATION_DURATION = 0.2;
    this.ANIMATION_STEP = Math.round(this.PAGE_INTERVAL_X / (this.ANIMATION_DURATION * 60));
    
    this.skinController = SkinController.getInstance();
    this.currentTextures = {};
    
    this.gems = this.entity.root.findByName('Gems');
    this.hoopsTab = this.entity.findByName('Hoop button');
    this.ballsTab = this.entity.findByName('Ball button');
    this.skinPriceText = this.entity.findByName('Skin price');
    this.starGroup = this.entity.findByName('Star group');
    this.stars = this.starGroup.findByTag('star');
    this.frameGroup = this.entity.findByName('Frame group');
    this.frames = this.frameGroup.findByTag('frame');
    this.freeGemsNumber = this.entity.findByName('Free Gems Num');
    this.freeGemsButton = this.entity.findByName('Free Gems Button');
    this.freeGemsButtonGroup = this.entity.findByName('Free Gems Button Group');
    this.buyButton = this.entity.findByName('Buy Button');
    this.buyButtonGroup = this.entity.findByName('Buy Button Group');
    this.buyButtonStates = this.entity.findByTag('buy-state');
    this.skinGroups = this.entity.findByName('Skin group container');
    this.skinContainers = this.skinGroups.findByTag('skin');
    this.skinCells = this.skinGroups.findByTag('skin-cell');
    this.slideR = this.entity.findByName('Slide R group');
    this.slideRstates = this.slideR.findByTag('slide-state');
    this.slideL = this.entity.findByName('Slide L group');
    this.slideLstates = this.slideL.findByTag('slide-state');
    
    this.demoContainer = this.entity.root.findByName('Demo container');
    this.ballModel = this.demoContainer.findByName('Ball Model');
    this.hoopModel = this.demoContainer.findByName('Tor Model');
    
    this.freeGemsButtonGroup.enabled = window.famobi.hasRewardedAd() && pc.platform.mobile;
    
    updateTexture(this.ballModel, loadTexture(SkinController.SKIN_TYPES.BALL) || 
        this.skinController.getFirstUnlocked(SkinController.SKIN_TYPES.BALL).getTexture());
    
    updateTexture(this.hoopModel, loadTexture(SkinController.SKIN_TYPES.HOOP) || 
        this.skinController.getFirstUnlocked(SkinController.SKIN_TYPES.HOOP).getTexture());
    
    closeButton.element.on('click', function (event) {
        event.stopPropagation();

        this.entity.enabled = false;
        this.demoContainer.enabled = false;
        
        if (this.onClose)
            this.onClose();
        
        this.onClose = undefined;
        
        Controllers.soundController.play(Conf.SOUNDS.POPUP_CLOSE);
    }.bind(this), this);
    
    hoopsTab.element.on('click', function (event) {
        event.stopPropagation();

        this.setActiveTab(SkinController.SKIN_TYPES.HOOP);
        
        Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
    }.bind(this), this);
    
    ballsTab.element.on('click', function (event) {
        event.stopPropagation();

        this.setActiveTab(SkinController.SKIN_TYPES.BALL);
        
        Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
    }.bind(this), this);
    
    this.skinGroups.element.on('touchstart', onMouseDown);
    this.skinGroups.element.on('mousedown', onMouseDown);
    
    this.buyButton.element.on('click', function (event) {
        var unlockedSkin,
            skinIndex;
        
        event.stopPropagation();
        
        this.gems.script.gemsCounter.sub(this.skinsPrice);
        this.skinController.raiseSkinCost(this.activeTab, this.getRarity(this.activePageIndex));
        
        unlockedSkin = this.unlockRandomSkin(this.activePageIndex, this.activeTab);
        skinIndex = this.skinController.getIndexBySkin(unlockedSkin);
        onCellSelected(skinIndex);
        
        this.skinCells[skinIndex].script.animateScale.play();
        
        this.setPage(this.activePageIndex);
    }.bind(this), this);
    
    this.freeGemsButton.element.on('click', function (event) {
        var GEMS_NUM = 10,
            INTERVAL = 75,
            i = 0,
            
            runGem = function () {
                var gemEntity = this.entity.findByName('Aminated gem'),
                    gem = gemEntity.clone();

                gemEntity.parent.addChild(gem);
                gem.enabled = true;
            }.bind(this);
        
        event.stopPropagation();
        
        if (this.showingAd)
            return;
        
        this.showingAd = true;
        
        window.famobi.rewardedAd(function () {
            Utils.wait(Conf.AD_FADE_OUT_TIME)
            .then(function () {
                while (i < GEMS_NUM) {
                    setTimeout(runGem, INTERVAL * i++);
                }

                this.gems.script.gemsCounter.add(Conf.GEMS_BY_AD);
                this.setPage(this.activePageIndex);
                this.showingAd = false;
            }.bind(this));
        }.bind(this));
    }.bind(this), this);
    
    this.slideLstates[0].element.on('click', function (event) {
        event.stopPropagation();

        this.setPage(this.activePageIndex - 1);
        
        Controllers.soundController.play(Conf.SOUNDS.POPUP_SWIPE);
    }.bind(this), this);
    
    this.slideRstates[0].element.on('click', function (event) {
        event.stopPropagation();

        this.setPage(this.activePageIndex + 1);
        
        Controllers.soundController.play(Conf.SOUNDS.POPUP_SWIPE);
    }.bind(this), this);
    
    this.skinCells.forEach(function (skinCell, index) {
        skinCell.element.on('click', function() {
            if (!this.skinDrag)
                onCellSelected(index);
        }.bind(this));
    }.bind(this));
};

Customisation.prototype.show = function(onClose) {
    this.onClose = onClose;
    this.entity.enabled = true;
    this.demoContainer.enabled = true;
    this.activeTab = SkinController.SKIN_TYPES.HOOP;
    this.rotationY = 0;
    
    this.setActiveTab(this.activeTab);
    
    Controllers.soundController.play(Conf.SOUNDS.POPUP_OPEN);
};

Customisation.prototype.getRarity = function(pageIndex) {
    return Utils.getValues(SkinController.SKIN_RARITY)[pageIndex];
};

Customisation.prototype.setActiveTab = function(tab) {
    this.activePageIndex = 0;
    this.activeTab = tab;
    this.hoopsTab.setLocalScale(tab == SkinController.SKIN_TYPES.HOOP ? pc.Vec3.ONE : this.INACTIVE_TAB_SCALE);
    this.ballsTab.setLocalScale(tab == SkinController.SKIN_TYPES.BALL ? pc.Vec3.ONE : this.INACTIVE_TAB_SCALE);
    
    this.frames[2].enabled = tab == SkinController.SKIN_TYPES.HOOP;
    
    this.ballModel.enabled = tab == SkinController.SKIN_TYPES.BALL;
    this.hoopModel.enabled = tab == SkinController.SKIN_TYPES.HOOP;
    
    this.initPages();
    this.setPage(this.activePageIndex);
    this.skinGroups.setLocalPosition(pc.Vec3.ZERO);
};

Customisation.prototype.initPages = function() {
    var skins = this.skinController.getSkinsByType(this.activeTab),
        textureIndex;
    
    skins.forEach(function (skin, index) {
        var skinContainer = this.skinContainers[index];
            
        skinContainer.element.texture = skin.getRender().resource;
    }.bind(this));
    
    textureIndex = this.skinController.getSkinIndexByTexture(this.currentTextures[this.getTargetModel().name], 
                                                               this.activeTab);
    this.setSelectedSkin(textureIndex);
};

Customisation.prototype.getNumPages = function () {
    return this.activeTab == SkinController.SKIN_TYPES.HOOP ? 3 : 2;
};

Customisation.prototype.setPage = function(pageIndex) {
    var numPages = this.getNumPages();
    
    this.activePageIndex = pageIndex;
    this.skinsPrice = this.skinController.getSkinCost(this.activeTab, this.getRarity(pageIndex));
    
    this.slideLstates[0].enabled = pageIndex !== 0;
    this.slideLstates[1].enabled = pageIndex === 0;
    
    this.slideRstates[0].enabled = pageIndex != numPages - 1;
    this.slideRstates[1].enabled = pageIndex == numPages - 1;
    
    this.buyButtonGroup.enabled = this.skinsPrice && 
        this.skinController.hasLockedSkins(this.activeTab, this.getRarity(pageIndex));
    
    this.buyButtonStates[0].enabled = this.gems.script.gemsCounter.getGems() >= this.skinsPrice; // active
    this.buyButtonStates[1].enabled = this.gems.script.gemsCounter.getGems() < this.skinsPrice;  // inactive
    this.skinPriceText.element.text = this.skinsPrice || "";
    this.freeGemsNumber.element.text = Conf.GEMS_BY_AD;
    
    this.stars.forEach(function (star, index) {
        star.enabled = index <= this.activePageIndex;
    }.bind(this));
    
    this.frames.forEach(function (frame, index) {
        var states = frame.findByTag('frame-state');
        
        states[0].enabled = index == this.activePageIndex; // active
        states[1].enabled = index != this.activePageIndex; // inactive
        
        frame.setLocalScale(index == this.activePageIndex ? pc.Vec3.ONE : this.INACTIVE_TAB_SCALE);
    }.bind(this));
};

Customisation.prototype.getTargetModel = function() {
    return this.activeTab == SkinController.SKIN_TYPES.HOOP ? this.hoopModel : this.ballModel;
};

Customisation.prototype.getPlayerTexture = function() {
    return this.currentTextures[this.hoopModel.name];
};

Customisation.prototype.setSelectedSkin = function(cellIndex) {
    var skins = this.skinController.getSkinsByType(this.activeTab),
        unlocked,
        skinCell,
        skinRender,
        bgStates;
    
    skins.forEach(function (skin, index) {
        skinCell = this.skinCells[index];
        unlocked = !this.skinController.isLocked(skin);
        
        bgStates = skinCell.findByTag('bg-state');
        bgStates[0].enabled = unlocked && cellIndex != index; // inactive
        bgStates[1].enabled = unlocked && cellIndex == index; // active
        bgStates[2].enabled = !unlocked;                      // locked
        
        skinRender = skinCell.findByName('Skin');
        skinRender.enabled = unlocked;
    }.bind(this));
};

Customisation.prototype.unlockRandomSkin = function(page, tab) {
    var skinTypes = Utils.getValues(SkinController.SKIN_TYPES),
        skinTypeBuffer = tab ? [tab] : skinTypes.slice(),
        skinType,
        unlockedSkin,
        
        selectRandomSkin = function (skinPage) {
            var skinBuffer = skinPage.slice(),
                skinIndex,
                skin;
            
            while (skinBuffer.length) {
                skin = skinBuffer.splice(Utils.getRandomIndex(skinBuffer), 1)[0];
                
                if (this.skinController.isLocked(skin))
                    return skin;
            }
        }.bind(this);
    
    while (skinTypeBuffer.length) {
        skinType = skinTypeBuffer.splice(Utils.getRandomIndex(skinTypeBuffer), 1)[0];        
        unlockedSkin = selectRandomSkin(this.skinController.getSkinsByRarity(skinType, this.getRarity(page)));
        
        if (unlockedSkin) {
            this.skinController.unlock(unlockedSkin);
            
            Controllers.soundController.play(Conf.SOUNDS.SKIN_UNLOCKED);
            
            return unlockedSkin;
        }
    }
    
    return false;
};

// update code called every frame
Customisation.prototype.update = function(dt) {
    var skinGroupX = -this.activePageIndex * this.PAGE_INTERVAL_X,
        localPos = this.skinGroups.getLocalPosition().clone(),
        currentX = localPos.x,
        step = this.ANIMATION_STEP;
    
    this.rotationY = (this.rotationY + 1) % 360;
    this.demoContainer.setLocalRotation(new pc.Quat().setFromEulerAngles(0, this.rotationY, 0));
    
    if (currentX == skinGroupX || this.skinDrag)
        return;
    
    if (step > Math.abs(currentX - skinGroupX))
        step = 1;
    
    if (currentX < skinGroupX)
        localPos.x += step;
    
    if (currentX > skinGroupX)
        localPos.x -= step;
    
    this.skinGroups.setLocalPosition(localPos);
};