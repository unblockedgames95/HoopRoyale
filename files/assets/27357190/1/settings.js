var Settings = pc.createScript('settings');

// initialize code called once per entity
Settings.prototype.postInitialize = function() {
    var closeSettingsButton = this.entity.findByName('Close button'),
    
        activateDouble = function (event) {
            if (event)
                event.stopPropagation();

            this.doubleTap.script.settingsFrame.makeActive();
            this.singleTap.script.settingsFrame.makeInactive();

            Conf.GAME_MODE = Conf.GAME_MODES.DOUBLE;
            Utils.setStorageItem(Conf.STORAGE_KEYS.GAME_MODE, Conf.GAME_MODE);
            Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
        }.bind(this),
        
        activateSingle = function (event) {
            if (event)
                event.stopPropagation();

            this.singleTap.script.settingsFrame.makeActive();
            this.doubleTap.script.settingsFrame.makeInactive();

            Conf.GAME_MODE = Conf.GAME_MODES.SINGLE;
            Utils.setStorageItem(Conf.STORAGE_KEYS.GAME_MODE, Conf.GAME_MODE);
            Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
        }.bind(this);
    
    this.doubleTap = this.entity.findByName('Double tap');
    this.singleTap = this.entity.findByName('Single tap');
    
    if (Conf.GAME_MODE == Conf.GAME_MODES.SINGLE)
        activateSingle();
    else 
        activateDouble();
    
    this.doubleTap.element.on('click', activateDouble);
    this.singleTap.element.on('click', activateSingle);
    
    closeSettingsButton.element.on('click', function (event) {
        event.stopPropagation();

        this.entity.enabled = false;
        
        Controllers.soundController.play(Conf.SOUNDS.POPUP_CLOSE);
    }.bind(this), this);
};

