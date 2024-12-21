var Utils = {};

// initialize code called once per entity
Utils.getOrthogonalVectors = function (n, p, q) {
    // From the Bullet sourcebase. See btPlaneSpace1.
    // Generate two suitable orthogonal vectors to n.
    var a, k;
    if (Math.abs(n.z) > 0.7071067811865475244008443621048490) {
        // choose p in y-z plane
        a = n.y * n.y + n.z * n.z;
        k = 1 / Math.sqrt(a);
        p.x = 0;
        p.y = -n.z * k;
        p.z = n.y * k;
        // set q = n x p
        q.x = a * k;
        q.y = -n.x * p.z;
        q.z = n.x * p.y;
    } else {
        // choose p in x-y plane
        a = n.x * n.x + n.y * n.y;
        k = 1 / Math.sqrt(a);
        p.x = -n.y * k;
        p.y = n.x * k;
        p.z = 0;
        // set q = n x p
        q.x = -n.z * p.y;
        q.y = n.z * p.x;
        q.z = a * k;
    }
};

Utils.isLandscape = function () {
    return pc.app.graphicsDevice.width > pc.app.graphicsDevice.height;
};

Utils.getRandomIndex = function(array) {
    return array.length ? Math.round(Math.random() * (array.length - 1)) : -1;
};

Utils.getValues = function (obj) {
    var keys = Object.keys(obj),
        values = [];
    
    keys.forEach(function (key, index) {
        values.push(obj[key]);
    });
    
    return values;
};

Utils.getStorageItem = function (key) {
    var item = window.famobi.localStorage.getItem(key),
        parsed;
    
    try {
        parsed = JSON.parse(item);
    } catch(e) {
        parsed = item;
    }
        
    return parsed;
};

Utils.setStorageItem = function (key, value) {
    window.famobi.localStorage.setItem(key, JSON.stringify(value));
};

Utils.throwDice = function (probability) {
    var rand = Math.random();
    
    return rand <= probability;
};
        
Utils.wait = function (timeout) {
    return new Promise(function(res, rej) {
        setTimeout(function () {
            res();
        }, timeout);
    });
};