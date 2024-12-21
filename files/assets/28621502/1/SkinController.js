var SkinController = function () {
    this.unlockedSkins = Utils.getStorageItem(Conf.STORAGE_KEYS.UNLOCKED_SKINS) || {};
    this.unlockedSkins[SkinController.SKIN_TYPES.BALL] = this.unlockedSkins[SkinController.SKIN_TYPES.BALL] || [];
    this.unlockedSkins[SkinController.SKIN_TYPES.HOOP] = this.unlockedSkins[SkinController.SKIN_TYPES.HOOP] || [];
    
    this.skins = [new Skin(SkinController.SKIN_TYPES.BALL, 'greenlight',  SkinController.SKIN_RARITY.COMMON, 0, 0.03, 0.11),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'blackwhite',  SkinController.SKIN_RARITY.COMMON, 0, 0.03, 0.11),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'grad',        SkinController.SKIN_RARITY.COMMON, 0, 0.08, 0.09),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'dragon',      SkinController.SKIN_RARITY.COMMON, 0, 0.08, 0.09),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'ruby',        SkinController.SKIN_RARITY.COMMON, 0, 0.10, 0.04),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'orange',      SkinController.SKIN_RARITY.COMMON, 0, 0.10, 0.04),

                  new Skin(SkinController.SKIN_TYPES.BALL, 'watermellon', SkinController.SKIN_RARITY.TOURNAMENT, 15),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'bowlingball', SkinController.SKIN_RARITY.TOURNAMENT, 27),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'rainbow',     SkinController.SKIN_RARITY.TOURNAMENT, 9),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'playball',    SkinController.SKIN_RARITY.TOURNAMENT, 33),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'nose',        SkinController.SKIN_RARITY.TOURNAMENT, 3),
                  new Skin(SkinController.SKIN_TYPES.BALL, 'stone',       SkinController.SKIN_RARITY.TOURNAMENT, 21),

                  new Skin(SkinController.SKIN_TYPES.HOOP, 'green',       SkinController.SKIN_RARITY.COMMON, 0, 0.03, 0.11),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'pink',        SkinController.SKIN_RARITY.COMMON, 0, 0.03, 0.11),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'orange',      SkinController.SKIN_RARITY.COMMON, 0, 0.08, 0.09),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'bluewhite',   SkinController.SKIN_RARITY.COMMON, 0, 0.08, 0.09),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'candyblue',   SkinController.SKIN_RARITY.COMMON, 0, 0.10, 0.04),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'pinkcandy',   SkinController.SKIN_RARITY.COMMON, 0, 0.10, 0.04),

                  new Skin(SkinController.SKIN_TYPES.HOOP, 'hue',         SkinController.SKIN_RARITY.TOURNAMENT, 1),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'pp',          SkinController.SKIN_RARITY.TOURNAMENT, 6),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'snake1',      SkinController.SKIN_RARITY.TOURNAMENT, 18),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'wheel',       SkinController.SKIN_RARITY.TOURNAMENT, 24),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'snake',       SkinController.SKIN_RARITY.TOURNAMENT, 12),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'minecraft',   SkinController.SKIN_RARITY.TOURNAMENT, 30),

                  new Skin(SkinController.SKIN_TYPES.HOOP, 'poke',        SkinController.SKIN_RARITY.LEGENDARY, 0, 0.02, 0),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'donut',       SkinController.SKIN_RARITY.LEGENDARY, 0, 0.02, 0),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'rainbow',     SkinController.SKIN_RARITY.LEGENDARY, 0, 0.02, 0),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'honey',       SkinController.SKIN_RARITY.LEGENDARY, 0, 0.03, 0.01),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'flag',        SkinController.SKIN_RARITY.LEGENDARY, 0, 0.03, 0.01),
                  new Skin(SkinController.SKIN_TYPES.HOOP, 'save',        SkinController.SKIN_RARITY.LEGENDARY, 0, 0.03, 0.01)];
    
    if (!this.unlockedSkins[SkinController.SKIN_TYPES.BALL].length)
        this.unlock(this.getSkinByIndex(0, SkinController.SKIN_TYPES.BALL));
    
    if (!this.unlockedSkins[SkinController.SKIN_TYPES.HOOP].length)
        this.unlock(this.getSkinByIndex(0, SkinController.SKIN_TYPES.HOOP));
};

SkinController.LBOX_TYPES = {HARD: 'loot',
                             SIMPLE: 'miniLoot'};

SkinController.SKIN_TYPES = {BALL: 'ball',
                             HOOP: 'hoop'};

SkinController.SKIN_RARITY = {
    COMMON: 'common',           //Purchased with Gems
    TOURNAMENT: 'tournament',   //Obtained by winning a Tournament Final Round
    LEGENDARY: 'legendary'      //Purchased with Gems (more expensive than common)
};

SkinController.SKIN_COST_DESKTOP = {};
SkinController.SKIN_COST_DESKTOP[SkinController.SKIN_TYPES.HOOP + '_' + SkinController.SKIN_RARITY.COMMON] = 
    [150, 200, 250, 300, 350, 400];
SkinController.SKIN_COST_DESKTOP[SkinController.SKIN_TYPES.HOOP + '_' + SkinController.SKIN_RARITY.LEGENDARY] = 
    [400, 500, 600, 700, 800, 900];
SkinController.SKIN_COST_DESKTOP[SkinController.SKIN_TYPES.BALL + '_' + SkinController.SKIN_RARITY.COMMON] = 
    [150, 250, 350, 450, 550, 650];

SkinController.SKIN_COST_MOBILE = {};
SkinController.SKIN_COST_MOBILE[SkinController.SKIN_TYPES.HOOP + '_' + SkinController.SKIN_RARITY.COMMON] = 
    [300, 400, 500, 600, 700, 800];
SkinController.SKIN_COST_MOBILE[SkinController.SKIN_TYPES.HOOP + '_' + SkinController.SKIN_RARITY.LEGENDARY] = 
    [800, 1000, 1200, 1400, 1600, 1800];
SkinController.SKIN_COST_MOBILE[SkinController.SKIN_TYPES.BALL + '_' + SkinController.SKIN_RARITY.COMMON] = 
    [300, 500, 700, 900, 1100, 1300];

SkinController.getInstance = function () {
    SkinController.instance = SkinController.instance || new SkinController();
    return SkinController.instance;
};

SkinController.prototype.getTournamentSkin = function (tour) {
    return this.skins.find(function (skin) {
            return skin.tour == tour;
        });
};

SkinController.prototype.getLootBoxSkin = function (lootType) {
    var rand = Math.random(),
        probCounter = 0,
        lootBoxSkins = this.skins.filter(function (skin) {
            return !!skin[lootType + 'W'];
        }),
        selectedSkin;
    
    for (var i = 0; i < lootBoxSkins.length; i++) {
        probCounter += lootBoxSkins[i][lootType + 'W'];
        
        if (probCounter - lootBoxSkins[i][lootType + 'W'] < rand && rand <= probCounter) {
            selectedSkin = lootBoxSkins[i];
            break;
        }
    }
    
    return this.isLocked(selectedSkin) ? selectedSkin : null;
};

SkinController.prototype.getSkinCost = function (type, rarity) {
    var skinCostTable = pc.platform.desktop ? SkinController.SKIN_COST_DESKTOP : SkinController.SKIN_COST_MOBILE,
        purchaseCount = this.getPurchaseCount(type, rarity),
        priceGroup = skinCostTable[type + '_' + rarity];
    
    return priceGroup ? priceGroup[purchaseCount] : 0;
};

SkinController.prototype.raiseSkinCost = function (type, rarity) {
    var purchaseCountObj = this.getPurchaseCountSafe(type, rarity);
    
    purchaseCountObj[type][rarity]++;
    
    Utils.setStorageItem(Conf.STORAGE_KEYS.PURCHASE_COUNT, purchaseCountObj);
};

SkinController.prototype.getPurchaseCount = function (type, rarity) {
    var purchaseCountObj = this.getPurchaseCountSafe(type, rarity);
    
    return purchaseCountObj[type][rarity];
};

SkinController.prototype.getPurchaseCountSafe = function (type, rarity) {
    var purchaseCountObj = Utils.getStorageItem(Conf.STORAGE_KEYS.PURCHASE_COUNT) || {};
        
    purchaseCountObj[type] = purchaseCountObj[type] || {};
    purchaseCountObj[type][rarity] = purchaseCountObj[type][rarity] || 0;
    
    return purchaseCountObj;
};

SkinController.prototype.getSkinByIndex = function (index, type) {
    var skinsOfType = this.getSkinsByType(type);
    
    return skinsOfType[index];
};

SkinController.prototype.getSkinIndexByTexture = function (texture, type) {
    var skinsOfType = this.getSkinsByType(type);
    
    return skinsOfType.findIndex(function (skin) {
            return skin.getTexture().id == texture.id;
        });
};

SkinController.prototype.getSkinsByRarity = function (type, rarity) {
    return this.skins.filter(function (skin) {
        return skin.type == type && skin.rarity == rarity;
    });
};

SkinController.prototype.getSkinsByType = function (type) {
    return this.skins.filter(function (skin) {
        return skin.type == type;
    });
};

SkinController.prototype.getIndexBySkin = function (skin) {
    var skinsOfType = this.getSkinsByType(skin.type);
    
    return skinsOfType.findIndex(function (skinOfType) {
            return skinOfType == skin;
        });
};

SkinController.prototype.isLocked = function (skin) {
    return this.unlockedSkins[skin.type].indexOf(skin.name) < 0;
};

SkinController.prototype.unlock = function (skin) {
    this.unlockedSkins[skin.type].push(skin.name);
    
    Utils.setStorageItem(Conf.STORAGE_KEYS.UNLOCKED_SKINS, this.unlockedSkins);
    
    if (this.unlockedSkins[SkinController.SKIN_TYPES.BALL].length + 
        this.unlockedSkins[SkinController.SKIN_TYPES.HOOP].length == 30)
        window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.UNLOCK_SKINS_ALL, 30);

    if (skin.type == SkinController.SKIN_TYPES.BALL && this.unlockedSkins[SkinController.SKIN_TYPES.BALL].length == 12)
        window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.UNLOCK_SKINS_BALL, 12);
    
    if (skin.type == SkinController.SKIN_TYPES.HOOP && this.unlockedSkins[SkinController.SKIN_TYPES.HOOP].length == 18)
        window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.UNLOCK_SKINS_HOOP, 18);
};

SkinController.prototype.hasLockedSkins = function (type, rarity) {
    var skinsOfType = this.getSkinsByRarity(type, rarity);
    
    return !!skinsOfType.find(function (skin) {
            return this.isLocked(skin);
        }.bind(this));
};

SkinController.prototype.getFirstUnlocked = function (type) {
    var skinsOfType = this.getSkinsByType(type);
    
    return skinsOfType.find(function (skin) {
            return !this.isLocked(skin);
        }.bind(this));
};