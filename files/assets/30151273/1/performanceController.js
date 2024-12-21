var PerformanceController = pc.createScript('performanceController');

// initialize code called once per entity
PerformanceController.prototype.initialize = function() {
    this.MIN_FPS = 30;
    this.TIME_BAND = 1;
    
    //this.pixelRatioHud = this.entity.findByName('PixelRatio').element;
    //this.pixelRatioHud.text = 'PixelRatio: ' + this.app.graphicsDevice.maxPixelRatio;
    
    this.minDt = 1 / this.MIN_FPS;
    this.framesCount = 0;
    this.framesSum = 0;
};

// update code called every frame
PerformanceController.prototype.update = function(dt) {
    this.framesSum += dt;
    this.framesCount++;
        
    if (this.framesSum >= this.TIME_BAND) {
        var frameAve;
        
        frameAve = this.framesSum / this.framesCount;
        
        if (frameAve > this.minDt) {

            this.app.graphicsDevice.maxPixelRatio = 1;
            this.enabled = false;

            //this.pixelRatioHud.text = 'PixelRatio: ' + this.app.graphicsDevice.maxPixelRatio;
            window.famobi.log("set pixel ratio to 1");
            
            return;
        }
        
        this.framesCount = 0;
        this.framesSum = 0;
    }
};