Controllers = {};

Object.defineProperty(Controllers, 'soundController', {
    get: function() {
        return pc.app.root.findByName('Sound').sound; 
    }
});