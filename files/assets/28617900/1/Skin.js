var Skin = function (type, name, rarity, tour, lootW, miniLootW) {
    this.type = type;
    this.name = name;
    this.rarity = rarity;
    this.lootW = lootW; // loot-box weight
    this.miniLootW = miniLootW; // mini loot-box weight
    this.tour = tour;
};

Skin.prototype.getTexture = function () {
    return pc.app.assets.find(this.type + '_' + this.name + '_t', 'texture');
};

Skin.prototype.getRender = function () {
    return pc.app.assets.find(this.type + '_' + this.name + '_r', 'texture');
};