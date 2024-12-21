var TimerController = pc.createScript('timerController');

// initialize code called once per entity
TimerController.prototype.initialize = function() {
    var ROUND_TIME = 60,
        timerContainer = this.entity.findByName('Timer Container'),
        timer = this.entity.findByName('Game timer'),
        timerInt,
        timerActive = false,
        timerPaused = false,
        
        setTime = function (time) {
            timer.element.text = '00:' + (time < 10 ? '0' : '') + time;
        }.bind(this),
        
        tick = function () {
            setTime(--this.remainingTime);
            
            if (!this.remainingTime)
                this.app.fire('Round:end', this.roundMode);
            
        }.bind(this),
        
        startTimer = function () {
            timerInt = setInterval(tick, 1000);
        }.bind(this),
        
        stopTimer = function () {
            clearInterval(timerInt);
        }.bind(this),
        
        resetTimer = function () {
            this.remainingTime = ROUND_TIME;
            setTime(this.remainingTime);
        }.bind(this);
    
    this.app.on('Round:enter', function (roundMode) {   
        timerContainer.enabled = (roundMode == Conf.ROUND_MODE);
        resetTimer();
        this.roundMode = roundMode;
    }.bind(this));
    
    this.app.on('Round:start', function (roundMode) {
        if (roundMode == Conf.ROUND_MODE) {
            timerActive = true;
            timerPaused = false;
            startTimer();
        }
    });
    this.app.on('Round:end', function () {
        stopTimer();
        timerActive = false;
        timerPaused = false;
    });
    this.app.on('Round:exit', function () {
        stopTimer();
        timerActive = false;
        timerPaused = false;
    });
    
    this.app.on('Game:pause', function () {
        if (timerActive) {
            stopTimer();
            timerPaused = true;
        }
    });
    this.app.on('Game:unpause', function () {
        if (timerPaused) {
            timerPaused = false;
            startTimer();
        }
    });
};
