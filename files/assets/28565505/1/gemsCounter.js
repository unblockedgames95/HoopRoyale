var GemsCounter = pc.createScript('gemsCounter');

// initialize code called once per entity
GemsCounter.prototype.initialize = function() {
    this.ANIMATION_DURATION = 1;
    this.gemsNum = Utils.getStorageItem(Conf.STORAGE_KEYS.GEMS) || 0;
    this.collectGems = Utils.getStorageItem(Conf.STORAGE_KEYS.COLLECT_GEMS) || 0;
    this.gemsReported = Utils.getStorageItem(Conf.STORAGE_KEYS.GEMS_REPORTED) || false;
    this.gemsText = this.entity.findByName('Gem text');
    this.displayedNum = this.gemsNum;
    this.gemsText.element.text = this.displayedNum + "";
    this.step = 1;
    
    this.app.on('Round:enter', function () {
        this.entity.enabled = false;
    }.bind(this));
    
    this.app.on('Round:exit', function () {
        this.entity.enabled = true;
    }.bind(this));
};

GemsCounter.prototype.add = function(num) {
    this.calcStep(num);
    this.gemsNum += num;
    this.collectGems += num;
    
    Utils.setStorageItem(Conf.STORAGE_KEYS.COLLECT_GEMS, this.collectGems);
    
    if (this.collectGems >= 10000 && !this.gemsReported) {
        this.gemsReported = true;
        
        window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.COLLECT_GEMS, 10000);
        Utils.setStorageItem(Conf.STORAGE_KEYS.GEMS_REPORTED, this.gemsReported);
    }
    
    Controllers.soundController.play(Conf.SOUNDS.EARN_GEM);
    
    Utils.setStorageItem(Conf.STORAGE_KEYS.GEMS, this.gemsNum);
};

GemsCounter.prototype.sub = function(num) {
    this.calcStep(num);
    this.gemsNum -= num;
    
    Utils.setStorageItem(Conf.STORAGE_KEYS.GEMS, this.gemsNum);
};

GemsCounter.prototype.getGems = function() {
    return this.gemsNum;
};

GemsCounter.prototype.calcStep = function(num) {
    this.step = Math.round(num / (this.ANIMATION_DURATION * 60));
};

// update code called every frame
GemsCounter.prototype.update = function(dt) {
    if (this.step > Math.abs(this.displayedNum - this.gemsNum))
        this.step = 1;
    
    if (this.displayedNum < this.gemsNum) {
        this.displayedNum += this.step;
        this.gemsText.element.text = this.displayedNum + "";
    } else if (this.displayedNum > this.gemsNum) {
        this.displayedNum -= this.step;
        this.gemsText.element.text = this.displayedNum + "";
    }
};