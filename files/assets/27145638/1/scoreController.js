var ScoreController = pc.createScript('scoreController');

// initialize code called once per entity
ScoreController.prototype.initialize = function() {
    this.initScores();
    this.initTournament();
    this.initProgression();
};

ScoreController.prototype.initScores = function() {
    this.playerScoreHUD = this.entity.findByName('Score board l');
    this.AIScoreHUD = this.entity.findByName('Score board r');
    
    this.totalGamesWon = Utils.getStorageItem(Conf.STORAGE_KEYS.TOTAL_GAMES_WON) || 0;
    this.totalGamesLost = Utils.getStorageItem(Conf.STORAGE_KEYS.TOTAL_GAMES_LOST) || 0;
    this.playerTotalScore = Utils.getStorageItem(Conf.STORAGE_KEYS.TOTAL_SCORE) || 0;
    
    var ingameHud           = this.entity.findByName('Ingame HUD'),
        finalRoundPSystem   = this.entity.findByName('Final Round Particle System'),
        scoreContainerL     = this.playerScoreHUD.findByName("score container"),
        scoreContainerR     = this.AIScoreHUD.findByName("score container"),
        scoreContainersL,
        scoreContainersR,
        newScoreContainer,
        i,
        
        onTorScore = function (event) {
            if (this.playerScore == this.targetScore || this.aiScore == this.targetScore)
                return;
            
            var hud = event.entity.name == Conf.TOR_PLAYER ? this.playerScoreHUD : this.AIScoreHUD,
                playerScorePoints = hud.findByTag("score-point"),
                playerScorePlaces = hud.findByTag("score-place"),
                scoreNumber = hud.findByName('score number'),
                score = event.entity.name == Conf.TOR_PLAYER ? ++this.playerScore : ++this.aiScore;
            
            ingameHud.enabled = true;
        
            scoreNumber.element.text = score;
            playerScorePoints[score - 1].element.opacity = 1;
            playerScorePlaces[score - 1].element.opacity = 0;
            
            if (event.entity.name == Conf.TOR_PLAYER && (this.playerScore + this.playerTotalScore == 500))
                window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.COLLECT_BALL_ALL, this.playerTotalScore);
            
            if (event.entity.name == Conf.TOR_PLAYER)
                window.famobi_tracking.trackEvent(window.famobi_tracking.EVENTS.LEVEL_UPDATE, 
                                              {"score": this.playerScore});
            
            if (this.round == Conf.FINAL && score != this.targetScore)
                this.app.fire('Ball:teleport');
        
            if (score == this.targetScore) {
                Controllers.soundController.play(Conf.SOUNDS.SCORE_POINT_FINAL);
                
                setTimeout(function () {
                    this.app.fire('Round:end', this.roundMode);
                }.bind(this), 0);
            } else {
                Controllers.soundController.play(Conf.SOUNDS.SCORE_POINT);
            }
        }.bind(this);
    
    scoreContainerL.enabled = true;
    scoreContainerR.enabled = true;
    
    for (i = 0; i < Difficulty[Difficulty.length - 1][Conf.FINAL - 1]; i++) {
        newScoreContainer = scoreContainerL.clone();
        scoreContainerL.parent.addChild(newScoreContainer);
        
        newScoreContainer = scoreContainerR.clone();
        scoreContainerR.parent.addChild(newScoreContainer);
    }
    
    scoreContainersL = this.playerScoreHUD.findByTag("score-container");
    scoreContainersR = this.AIScoreHUD.findByTag("score-container");
    
    this.app.on('Round:enter', function (roundMode) {
            var playerScore = this.playerScoreHUD.findByName('score number'),
                aiScore = this.AIScoreHUD.findByName('score number'),
                
                initScoreContainers = function(scoreContainer, index) {
                    var scorePoint = scoreContainer.findByName('score'),
                        scorePlace = scoreContainer.findByName('score place');
                    
                    scoreContainer.element.opacity = 0;
                    scorePoint.element.opacity = 0;
                    scorePlace.element.opacity = 1;
                    scoreContainer.enabled = true;

                    if ((index + 1) > this.targetScore)
                        scoreContainer.enabled = false;
                }.bind(this);
        
            this.roundMode = roundMode;
            this.playerScore = 0;
            this.aiScore = 0;
            this.targetScore = this.getTargetScore();
        
            scoreContainersL.forEach(initScoreContainers);
            scoreContainersR.forEach(initScoreContainers);
        
            playerScore.element.text = '0';
            aiScore.element.text = '0';
        
            this.AIScoreHUD.enabled = (roundMode == Conf.ROUND_MODE);
        }.bind(this));
    
    this.app.on('Round:start', function () {
        this.app.on('tor:score', onTorScore);
        
        if (this.round == Conf.FINAL) {
            finalRoundPSystem.particlesystem.reset();
            finalRoundPSystem.particlesystem.play();
        }
    }.bind(this));
    
    this.app.on('Round:end', function (roundMode) {
        this.app.off('tor:score', onTorScore);
        
        if (roundMode != Conf.ROUND_MODE)
            return;
        
        this.playerTotalScore += this.playerScore;
        this.roundWon = this.playerScore >= this.aiScore;
        this.clearVictory = !this.aiScore;
        
        Utils.setStorageItem(Conf.STORAGE_KEYS.TOTAL_SCORE, this.playerTotalScore);
        
        this.app.fire('Player:' + (this.roundWon ? 'win' : 'loose'), event);
    }.bind(this));
    
    this.app.on('Round:exit', function () {
        this.app.off('tor:score', onTorScore);
        finalRoundPSystem.particlesystem.stop();
    }.bind(this));
};

ScoreController.prototype.getTargetScore = function() {
    var difficultyIndex = this.tournament <= Difficulty.length ? this.tournament : Difficulty.length;
    
    if (this.roundMode == Conf.TUTORIAL_MODE)
        return 5;
    
    return Difficulty[difficultyIndex - 1][this.round - 1];
};

ScoreController.prototype.getPrevRound = function() {
    return this.roundWon ? ((this.round - 1) || Conf.FINAL) : this.round;
};

ScoreController.prototype.initTournament = function() {
    var progressGroup = this.entity.findByName('Progress group'),
        rounds = progressGroup.findByTag('round-group'),
        tournamentIndex = this.entity.findByName('Trophy text'),
        skinController = SkinController.getInstance(),
        
        updateTournament = function () {
            var skin = skinController.getTournamentSkin(this.tournament),
                inactiveT = skin ? "skin stage.png" : "diamond stage.png",
                activeT = skin ? "skin stage active.png" : "diamond stage active.png";
            
            tournamentIndex.element.text = this.tournament;
        
            rounds.forEach(function (round, index) {
                var groupNum = index + 1,
                    roundStates = round.findByTag('round-state');
                
                    if (groupNum == Conf.FINAL) {
                        roundStates[0].element.texture = pc.app.assets.find(inactiveT, 'texture').resource;
                        roundStates[1].element.texture = pc.app.assets.find(activeT, 'texture').resource;
                    }

                    roundStates[0].enabled = (groupNum > this.round); // inactive
                    roundStates[1].enabled = (groupNum == this.round); // active
                    roundStates[2].enabled = (groupNum < this.round); // done
            }.bind(this));
        }.bind(this);
    
    this.tournament = Utils.getStorageItem(Conf.STORAGE_KEYS.TOURNAMENT) || 1;
    this.round = Utils.getStorageItem(Conf.STORAGE_KEYS.ROUND) || 1;
    
    updateTournament();
    
    this.app.on('Player:win', function () {
        if (this.round == Conf.FINAL) {
            this.tournament++;
            this.round = 1;
            
            Utils.setStorageItem(Conf.STORAGE_KEYS.TOURNAMENT, this.tournament);
            
            Controllers.soundController.play(Conf.SOUNDS.LEVEL_WIN);
            
            if (this.tournament - 1 == 30)
                window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.TOTAL_TOURNAMENT_WON, 30);
        } else {
            this.round++;
            this.totalGamesWon++;
            
            Utils.setStorageItem(Conf.STORAGE_KEYS.TOTAL_GAMES_WON, this.totalGamesWon);
            Controllers.soundController.play(Conf.SOUNDS.PROGRESS_WIN);
            
            if (this.totalGamesWon == 100)
                window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.TOTAL_GAMES_WON, this.totalGamesWon);
        }
        
        Utils.setStorageItem(Conf.STORAGE_KEYS.ROUND, this.round);
        
        updateTournament();
    }.bind(this));
    
    this.app.on('Player:loose', function () {
        this.totalGamesLost++;
        
        Utils.setStorageItem(Conf.STORAGE_KEYS.TOTAL_GAMES_LOST, this.totalGamesLost);
        Controllers.soundController.play(Conf.SOUNDS.PROGRESS_LOSS);
        
        if (this.totalGamesLost == 25)
            window.famobi_analytics.trackStats(Conf.ACHIEVEMENTS.TOTAL_GAMES_LOST, this.totalGamesLost);
    }.bind(this));
};

ScoreController.prototype.initProgression = function() {
    this.progressionScreen = this.entity.findByName('Progression screen');
    this.lootBoxScreen = this.entity.findByName('Loot Box Screen');
    this.continueButton = this.progressionScreen.findByName('Continue button');
    this.replayButton = this.progressionScreen.findByName('Replay button');
    
    this.replayButton.element.on('click', function (event) {
        event.stopPropagation();

        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELRESTART, {levelName: ""})
        .then(function () {
            this.progressionScreen.enabled = false;
        
            this.app.fire('Game:replay');

            Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
        }.bind(this));
    }.bind(this), this);
    
    this.continueButton.element.on('click', function (event) {
        event.stopPropagation();

        if (this.continueCallback)
            this.continueCallback();
        
        Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
    }.bind(this), this);
    
    this.gemsX2Button = this.entity.findByName('Gem x2 Button');
    this.openChestButton = this.entity.findByName('Open Chest Button');
    this.rewardGemsNumber = this.entity.findByName('Reward Gems Number');
    this.gems = this.entity.findByName('Gems');
    
    this.gemsX2Button.element.on('click', function (event) {
        var reward = parseInt(this.rewardGemsNumber.element.text);
        
        event.stopPropagation();
        
        this.continueButton.enabled = false;
        this.gemsX2Button.enabled = false;
        
        window.famobi.rewardedAd(function () {
                Utils.wait(Conf.AD_FADE_OUT_TIME)
                .then(function () {
                    this.gems.script.gemsCounter.add(reward);

                    this.rewardGemsNumber.element.text = reward * 2;

                    this.continueButton.enabled = true;
                }.bind(this));
            }.bind(this));
        
    }.bind(this));
    
    this.openChestButton.element.on('click', function (event) {
        event.stopPropagation();
        
        if (this.openChestCallback)
            this.openChestCallback();
        
        Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
    }.bind(this));
    
    this.app.keyboard.on("keydown", function (e) {
        e.event.preventDefault();

        if (e.key != pc.KEY_ENTER || !this.continueButton.enabled || !this.continueCallback)
            return;

        setTimeout(this.continueCallback.bind(this), 0);
    }.bind(this));
};

ScoreController.prototype.showProgression = function() {
    var TIMEOUT = 3000,
        skinController = SkinController.getInstance(),
        customisation = this.entity.findByName('Customisation screen').script.customisation,
        progressGroup = this.entity.findByName('Progress scr group'),
        chestHard = this.entity.findByName('Chest hard'),
        chestSimple = this.entity.findByName('Chest simple'),
        chestHardCap = chestHard.findByName('cap'),
        chestSimpleCap = chestSimple.findByName('cap'),
        rounds = progressGroup.findByTag('round-group'),
        leaderboardGroup = this.progressionScreen.findByName('Leaderboard group'),
        rewardGroup = this.progressionScreen.findByName('Reward Group'),
        rewardItem = this.progressionScreen.findByName('Reward item'),
        trophyIcon = this.progressionScreen.findByName('Trophy icon'),
        doneIcon = this.progressionScreen.findByName('Done icon'),
        crossIcon = this.progressionScreen.findByName('Cross icon'),
        prevRound = this.getPrevRound(),
        prevTournament = this.roundWon && prevRound == Conf.FINAL ? (this.tournament - 1) : this.tournament,
        skin = skinController.getTournamentSkin(prevTournament),
        failT = skin ? "progress 7.png" : "progress 9.png",
        doneT = skin ? "progress 5.png" : "progress 8.png",
        
        setRewardTexture = function (texture) {
            rewardItem.element.texture = texture.resource;
            
            rewardItem.script.animateScale.play();
        },
        
        giveReward = function (rewardSkin, rewardGems, finalReward) {
            var pr = new Promise(function (res, rej) {
                
                this.lootBoxScreen.enabled = false;
                this.openChestButton.enabled = false;
                this.rewardGemsNumber.enabled = !rewardSkin;
                this.continueCallback = res.bind(pr);

                doneIcon.enabled = false;
                trophyIcon.enabled = false;
                this.continueButton.enabled = true;
                progressGroup.enabled = false;
                leaderboardGroup.enabled = false;
                rewardGroup.enabled = true;

                if (rewardSkin) {
                    skinController.unlock(rewardSkin);

                    setRewardTexture(rewardSkin.getRender());

                    Controllers.soundController.play(Conf.SOUNDS.BOX_REWARD_APPEAR);
                    return;
                }

                Controllers.soundController.play(Conf.SOUNDS.GEM_APPEAR);

                this.gemsX2Button.enabled = !finalReward && window.famobi.hasRewardedAd() && pc.platform.mobile;

                this.rewardGemsNumber.element.text = rewardGems;

                setRewardTexture(this.app.assets.find('reward.png', 'texture'));
                this.gems.script.gemsCounter.add(rewardGems);

            }.bind(this));
            
            return pr;
        }.bind(this),
        
        lootBox = function () {
            if (!window.famobi.hasRewardedAd() || !pc.platform.mobile)
                return Promise.resolve();
            
            return new Promise(function (lootResolve, lootReject) {
                var pr = new Promise(function (res, rej) {
                
                    chestSimple.enabled = false;
                    chestHard.enabled = true;
                    this.lootBoxScreen.enabled = true;
                    this.openChestButton.enabled = true;
                    doneIcon.enabled = false;
                    trophyIcon.enabled = false;
                    this.continueButton.enabled = true;
                    progressGroup.enabled = false;
                    leaderboardGroup.enabled = false;
                    rewardGroup.enabled = false;
                    this.gemsX2Button.enabled = false;

                    this.openChestCallback = function () {
                        this.openChestButton.enabled = false;
                        this.continueButton.enabled = false;

                        window.famobi.rewardedAd(function () {
                                Utils.wait(Conf.AD_FADE_OUT_TIME)
                                .then(function () {
                                    res.call(pr);
                                });
                            });
                    }.bind(this);
                    this.continueCallback = rej.bind(pr);

                    chestHardCap.script.chestCap.close();
                    chestHard.script.animateScale.play();

                    Controllers.soundController.play(Conf.SOUNDS.BOX_APPEAR);
                }.bind(this))
                .then(function () {
                    this.continueButton.enabled = false;
                    Controllers.soundController.play(Conf.SOUNDS.BOX_OPEN);
                    return chestHardCap.script.chestCap.open();
                }.bind(this))
                .then(function () {
                    return giveReward(Utils.throwDice(Conf.LBOX_ITEM_PROBABILITY) ? 
                        skinController.getLootBoxSkin(SkinController.LBOX_TYPES.HARD) : null, Conf.LBOX_COMPENSATION);
                }.bind(this))
                .then(lootResolve)
                .catch(lootResolve);
            }.bind(this));
        }.bind(this),
        
        smallLootBox = function () {
            if (!this.clearVictory || !window.famobi.hasRewardedAd() || !pc.platform.mobile)
                return Promise.resolve();
            
            return new Promise(function (lootResolve, lootReject) {
                var pr = new Promise(function (res, rej) {
                    chestHard.enabled = false;
                    chestSimple.enabled = true;
                    this.lootBoxScreen.enabled = true;
                    this.openChestButton.enabled = true;
                    doneIcon.enabled = false;
                    trophyIcon.enabled = false;
                    this.continueButton.enabled = true;
                    progressGroup.enabled = false;
                    leaderboardGroup.enabled = false;
                    rewardGroup.enabled = false;
                    this.gemsX2Button.enabled = false;
                    
                    this.openChestCallback = function () {
                        this.openChestButton.enabled = false;
                        this.continueButton.enabled = false;

                        window.famobi.rewardedAd(function () {
                                Utils.wait(Conf.AD_FADE_OUT_TIME)
                                .then(function () {
                                    res.call(pr);
                                });
                            });
                    }.bind(this);
                    this.continueCallback = rej.bind(pr);

                    chestSimpleCap.script.chestCap.close();
                    chestSimple.script.animateScale.play();

                    Controllers.soundController.play(Conf.SOUNDS.BOX_APPEAR);
                }.bind(this))
                .then(function () {
                    this.continueButton.enabled = false;
                    Controllers.soundController.play(Conf.SOUNDS.BOX_OPEN);
                    return chestSimpleCap.script.chestCap.open();
                }.bind(this))
                .then(function () {
                    return giveReward(Utils.throwDice(Conf.MINI_LBOX_ITEM_PROBABILITY) ? 
                        skinController.getLootBoxSkin(SkinController.LBOX_TYPES.SIMPLE) : null, Conf.MINI_LBOX_COMPENSATION);
                }.bind(this))
                .then(lootResolve)
                .catch(lootResolve);
            }.bind(this));
        }.bind(this),
        
        interstitial = function () {
            var promises = [];

            if (this.roundWon)
                promises.push(window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELSUCCESS, {levelName: ""}));
            else
                promises.push(window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELFAIL, 
                                                                 {levelName: "", reason: "opponent_won"}));
            
            window.famobi_tracking.trackEvent(window.famobi_tracking.EVENTS.LEVEL_END,
                                            { "success": this.roundWon,
                                                "score": this.playerScore });
            
            promises.push(window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELSCORE, 
                                                             {levelName: "", levelScore: this.playerScore}));

            promises.push(window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_TOTALSCORE, 
                                                             {totalScore: this.playerTotalScore}));

            promises.push(window.famobi.showInterstitialAd());

            return Promise.all(promises);
        }.bind(this);
    
    this.progressionScreen.enabled = true;
    chestHard.enabled = false;
    chestSimple.enabled = false;
    rewardGroup.enabled = false;
    progressGroup.enabled = true;
    leaderboardGroup.enabled = this.roundWon;
    trophyIcon.enabled = this.roundWon && prevRound == Conf.FINAL;
    doneIcon.enabled = this.roundWon && prevRound != Conf.FINAL;
    crossIcon.enabled = !this.roundWon;
    this.continueButton.enabled = !this.roundWon;
    this.replayButton.enabled = !this.roundWon;
    this.gemsX2Button.enabled = false;
    this.openChestButton.enabled = false;
    this.lootBoxScreen.enabled = false;
    this.continueCallback = this.exitProgression;
    
    this.continueButton.element.texture = this.app.assets.find(this.roundWon ? 'play button.png' : 
                                                               'home button.png', 'texture').resource;
    
    rounds.forEach(function (round, index) {
        var groupNum = index + 1,
            roundStates = round.findByTag('round-state');

        if (groupNum == Conf.FINAL) {
            roundStates[0].element.texture = pc.app.assets.find(doneT, 'texture').resource;
            roundStates[1].element.texture = pc.app.assets.find(doneT, 'texture').resource;
            roundStates[2].element.texture = pc.app.assets.find(failT, 'texture').resource;
        }
        
        roundStates[0].enabled = (groupNum > prevRound);                                                    // inactive
        roundStates[1].enabled = ((groupNum <= prevRound) || (groupNum == prevRound && this.roundWon));     // done
        roundStates[2].enabled = (groupNum == prevRound && !this.roundWon);                                 // fail
        
        if (groupNum == prevRound)
            round.script.animateScale.play();
    }.bind(this));
    
    if (!this.roundWon)
        return;
    
    switch (prevRound) {
        case Conf.FIRST_ROUND:
            Utils.wait(TIMEOUT)
            .then(interstitial)
            .then(smallLootBox)
            .then(this.exitProgression.bind(this));

            break;
            
        case Conf.QUARTER_FINAL:
            Utils.wait(TIMEOUT)
            .then(interstitial)
            .then(smallLootBox)
            .then(function () {
                return giveReward(null, Conf.GEMS_BY_ROUND[prevRound - 1]);
            }.bind(this))
            .then(this.exitProgression.bind(this));
            
            break;
            
        case Conf.SEMI_FINAL:
            Utils.wait(TIMEOUT)
            .then(interstitial)
            .then(smallLootBox)
            .then(lootBox)
            .then(this.exitProgression.bind(this));

            break;
        
        case Conf.FINAL:
            Utils.wait(TIMEOUT)
            .then(interstitial)
            .then(smallLootBox)
            .then(function () {
                return giveReward(skin, Conf.GEMS_BY_ROUND[prevRound - 1], true);
            }.bind(this))
            .then(this.exitProgression.bind(this));
            
            break;
    }
};

ScoreController.prototype.exitProgression = function () {
    this.progressionScreen.enabled = false;
    this.lootBoxScreen.enabled = false;
    
    this.app.fire('Game:lobby');
};