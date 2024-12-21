var OpponentInfo = pc.createScript('opponentInfo');

// initialize code called once per entity
OpponentInfo.prototype.initialize = function() {
    var opponentFlag = this.entity.parent.findByName('Opponent flag');
    
    this.FLAGS_NUM = 20;
    this.oppenentInfoHud = this.entity.parent.findByName('Opponent Info');
    
    this.app.on('Round:enter', function () {
            var flagIndex = this.selectOpponent() + 1;

            if (flagIndex < 10)
                flagIndex = '0' + flagIndex;
        
            this.oppenentInfoHud.enabled = true;
            this.enabled = true;
        
            opponentFlag.element.texture = this.app.assets.find('flag_' + flagIndex + '.png', 'texture').resource;
        }.bind(this));
    
    this.app.on('Round:exit', function () {
            this.oppenentInfoHud.enabled = false;
            this.enabled = false;
        }.bind(this));
};

OpponentInfo.prototype.selectOpponent = function() {
    var previouslySelected = Utils.getStorageItem(Conf.STORAGE_KEYS.USED_FLAGS) || [],
        randOpponentIndex = Math.round(Math.random() * (this.FLAGS_NUM - 1));
    
    if (previouslySelected.length == this.FLAGS_NUM) {
        Utils.setStorageItem(Conf.STORAGE_KEYS.USED_FLAGS, [randOpponentIndex]);
    } else {
        while(previouslySelected.indexOf(randOpponentIndex) >= 0) {
            randOpponentIndex = (randOpponentIndex + 1) % this.FLAGS_NUM;
        }
        
        previouslySelected.push(randOpponentIndex);
        Utils.setStorageItem(Conf.STORAGE_KEYS.USED_FLAGS, previouslySelected);
    }
    
    return randOpponentIndex;
};

// update code called every frame
OpponentInfo.prototype.update = function(dt) {
    var pos = this.entity.getLocalPosition().clone();
    
    pos.y += 0.28;
    pos.z += 0.3;
    
    this.oppenentInfoHud.setLocalPosition(pos);
};
