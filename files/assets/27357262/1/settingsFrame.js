var SettingsFrame = pc.createScript('settingsFrame');

// initialize code called once per entity
SettingsFrame.prototype.initialize = function() {
    this.choice = this.entity.findByName('Choice');
    //this.tap = this.entity.findByName('Tap');
    //this.tapLeft = this.entity.findByName('Tap Left');
    //this.tapRight = this.entity.findByName('Tap Right');
    this.fade = this.entity.findByName('Frame fade');
};

SettingsFrame.prototype.makeActive = function() {
    this.entity.setLocalScale(new pc.Vec3(1, 1, 1));
    this.choice.enabled = true;
    this.fade.enabled = false;
};

SettingsFrame.prototype.makeInactive = function() {
    this.entity.setLocalScale(new pc.Vec3(0.9, 0.9, 0.9));
    this.choice.enabled = false;
    this.fade.enabled = true;
};

