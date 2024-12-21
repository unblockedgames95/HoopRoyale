var Leaderboard = pc.createScript('leaderboard');

// initialize code called once per entity
Leaderboard.prototype.initialize = function() {    
    var onEnable = function () {
        var finalInt = (this.scoreController.getPrevRound() == Conf.FINAL) + 0,
            benchmarkTime = Conf.BENCHMARK_OUTCOME[this.scoreController.targetScore][finalInt];
            
        this.percentage = {val: Math.round((this.timerController.remainingTime * 100) / benchmarkTime)};
        
        if (this.percentage.val >= 100) {
            this.percentage.val = 100;
            this.topLevelLeaderboard++;
            
            Utils.setStorageItem(Conf.STORAGE_KEYS.TOP_LEVEL_LEADERBOARD, this.topLevelLeaderboard);
            
            if (this.topLevelLeaderboard == 20)
                window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.TOP_LEVEL_LEADERBOARD, this.topLevelLeaderboard);
        }
        
        this.percentageVisible = {val: 0};
        this.leaderboardProgress.element.width = 0;
        this.userPosition.x = 0;
        this.leaderboardUser.setLocalPosition(this.userPosition);
        
        this.app
            .tween(this.percentageVisible)
            .to(this.percentage, 1, pc.QuadraticInOut)
            .loop(false)
            .yoyo(false)
            .on('update', function () {
                this.leaderboardUserPercent.element.text = Math.round(this.percentageVisible.val) + "%";
                this.leaderboardProgress.element.width = Math.round(this.leaderboardProgressWidth * 
                                                                    this.percentageVisible.val / 100);
                this.userPosition.x = this.leaderboardProgress.element.width;
                this.leaderboardUser.setLocalPosition(this.userPosition);
            }.bind(this))
            .start();
    }.bind(this);
    
    this.leaderboardProgress = this.entity.findByName('progress');
    this.leaderboardProgressBg = this.entity.findByName('progress bg');
    this.leaderboardUser = this.entity.findByName('user');
    this.leaderboardUserPercent = this.entity.findByName('user percent');
    this.userPosition = this.leaderboardUser.getLocalPosition().clone();
    this.leaderboardProgressWidth = this.leaderboardProgressBg.element.width;
    
    this.game = this.app.root.children[0];
    this.scoreController = this.game.script.scoreController;
    this.timerController = this.game.script.timerController;
    
    this.topLevelLeaderboard = Utils.getStorageItem(Conf.STORAGE_KEYS.TOP_LEVEL_LEADERBOARD) || 0;
     
    this.on('enable', onEnable);
    
    onEnable();
};