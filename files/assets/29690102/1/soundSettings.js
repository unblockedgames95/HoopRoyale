var SoundSettings = pc.createScript('soundSettings');

// initialize code called once per entity
SoundSettings.prototype.initialize = function() {
    var soundOnButton = this.entity.findByName('Sound on button'),
        soundOffButton = this.entity.findByName('Sound off button'),
        
        setState = function () {
            soundOnButton.enabled = !Controllers.soundController.volume;
            soundOffButton.enabled = !!Controllers.soundController.volume;
        }.bind(this);
    
    soundOnButton.element.on('click', function (event) {
        event.stopPropagation();
        
        soundOffButton.enabled = true;
        soundOnButton.enabled = false;
        
        Controllers.soundController.volume = 1;
        Utils.setStorageItem(Conf.STORAGE_KEYS.SOUND, 1);

        Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
        
        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_VOLUMECHANGE, {bgmVolume: 1, sfxVolume: 1});
    }.bind(this), this);
    
    soundOffButton.element.on('click', function (event) {
        event.stopPropagation();
        
        soundOnButton.enabled = true;
        soundOffButton.enabled = false;

        Controllers.soundController.volume = 0;
        Utils.setStorageItem(Conf.STORAGE_KEYS.SOUND, 0);
        
        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_VOLUMECHANGE, {bgmVolume: 0, sfxVolume: 0});
    }.bind(this), this);
    
    this.on('enable', setState);
    
    setState();
};