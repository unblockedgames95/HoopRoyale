var GameController = pc.createScript('gameController');

// initialize code called once per entity
GameController.prototype.postInitialize = function() {  
    this.lobbyScreen = this.entity.findByName('Lobby screen');
    this.tutorialScreen = this.entity.findByName('Tutorial screen');
    this.ballArrow = this.entity.findByName('Ball arrow container');
    this.pauseScreen = this.entity.findByName('Pause screen');
    this.settingsScreen = this.entity.findByName('Settings screen');
    this.finalScorePSystem = this.entity.findByName('Final Score Particle System');
    this.ingameHud = this.entity.findByName('Ingame HUD');
    this.overlayHud = this.entity.findByName('Overlay HUD');
    this.torEntity = this.entity.findByName('Tor');
    this.overlayText = this.entity.findByName('Overlay text');
    this.ball = this.entity.findByName('Ball');
    this.gems = this.entity.findByName('Gems');
    this.customisation = this.entity.findByName('Customisation screen').script.customisation;
    this.locationController = this.entity.script.locationController;
    this.scoreController = this.entity.script.scoreController;
    
    var playButton = this.lobbyScreen.findByName('Play button'),
        settingsButton = this.lobbyScreen.findByName('Settings button'),
        cartButton = this.lobbyScreen.findByName('Cart button'),
        pauseButton = this.entity.findByName('Pause button'),
        unpauseButton = this.pauseScreen.findByName('Unpause button'),
        homeButton = this.pauseScreen.findByName('Home button'),
        brandingImgUrl = window.famobi.getBrandingButtonImage(true),
        
        onPlayPressed = function () {
            window.famobi_tracking.trackEvent(window.famobi_tracking.EVENTS.LEVEL_START, 
                                              {"level": this.scoreController.tournament});

            window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELSTART, {levelName: ""})
            .then(function () {
                this.lobbyScreen.enabled = false;
                this.enterRound(Conf.ROUND_MODE);

                Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
            }.bind(this));
        }.bind(this);
    
    this.app.keyboard.on("keydown", function (e) {
        e.event.preventDefault();

        if (e.key != pc.KEY_ENTER || !playButton.enabled)
            return;

        onPlayPressed();
    }.bind(this));
    
    cartButton.element.on('click', function (event) {
        event.stopPropagation();

        this.lobbyScreen.enabled = false;
        
        this.customisation.show(this.enterLobby.bind(this));
    }.bind(this), this);
    
    playButton.element.on('click', function (event) {
        event.stopPropagation();
        
        onPlayPressed();
    }.bind(this), this);
    
    pauseButton.element.on('click', function (event) {
        event.stopPropagation();

        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_PAUSE)
        .then(function () {
            this.pauseScreen.enabled = true;

            this.app.timeScale = 0;
            this.app.fire('Game:pause');

            Controllers.soundController.play(Conf.SOUNDS.POPUP_OPEN);
        }.bind(this));
    }.bind(this), this);
    
    unpauseButton.element.on('click', function (event) {
        event.stopPropagation();

        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_RESUME)
        .then(function () {
            this.pauseScreen.enabled = false;

            this.app.timeScale = 1;
            this.app.fire('Game:unpause');

            Controllers.soundController.play(Conf.SOUNDS.POPUP_CLOSE);
        }.bind(this));
    }.bind(this), this);
    
    homeButton.element.on('click', function (event) {
        event.stopPropagation();
        
        window.famobi_analytics.trackEvent(window.famobi_analytics.EVENT_LEVELFAIL, {levelName: "", reason: "quit"})
        .then(function () {
            this.pauseScreen.enabled = false;

            this.app.fire('Round:interrupt');

            this.exitRound(true);

            Controllers.soundController.play(Conf.SOUNDS.BUTTON_PRESS);
        }.bind(this));
    }.bind(this), this);
    
    settingsButton.element.on('click', function (event) {
        event.stopPropagation();

        this.settingsScreen.enabled = true;
        
        Controllers.soundController.play(Conf.SOUNDS.POPUP_OPEN);
    }.bind(this), this);
    
    this.app.on('Game:replay', function () {
        this.enterRound(Conf.ROUND_MODE);
    }.bind(this), this);
    
    this.app.on('Game:lobby', function () {
        this.enterLobby();
    }.bind(this), this);
    
    this.app.on('Round:end', function (roundMode) {
        this.finalScorePSystem.particlesystem.reset();
        this.finalScorePSystem.particlesystem.play();
        
        pauseButton.enabled = false;
        this.app.timeScale = 0.3;
        
        if (roundMode == Conf.TUTORIAL_MODE)
            Utils.setStorageItem(Conf.STORAGE_KEYS.TUTORIAL, true);
        
        setTimeout(this.exitRound.bind(this), 2000);
    }.bind(this));
    
    if (brandingImgUrl) {
        var handler = this.app.loader.getHandler('texture');
        if (handler)
            handler.crossOrigin = 'anonymous';

        this.app.assets.loadFromUrl(brandingImgUrl, "texture", function (err, asset) {
            if (err) {
                window.famobi.log(err);
                return;
            }
            
            var texture = asset.resource,
                brandingButton = this.lobbyScreen.findByName('Branding Button');
            
            brandingButton.element.texture = texture;
            brandingButton.enabled = true;
            
             brandingButton.element.on('click', function (event) {
                event.stopPropagation();

                window.famobi.openBrandingLink();
            }.bind(this), this);
        }.bind(this));
    }
    
    this.customisation.initSkins();
    
    Controllers.soundController.volume = 0; // fix for iPhoneX standby/active muted state
    Controllers.soundController.volume = Utils.getStorageItem(Conf.STORAGE_KEYS.SOUND) !== null ? 
        Utils.getStorageItem(Conf.STORAGE_KEYS.SOUND) : 1;
    
    this.app.resizeCanvas(); // fix for Samsung browser on Galaxy S10+
    
    if (Utils.getStorageItem(Conf.STORAGE_KEYS.TUTORIAL))
        this.enterLobby();
    else
        this.enterRound(Conf.TUTORIAL_MODE);

    // add Famobi API pause handlers
    var _game = this;

    window.famobi_onPauseRequested = function() {
        _game.pauseScreen.enabled = true;
        _game.app.timeScale = 0;
        _game.app.fire('Game:pause');
        famobi.log("Application:paused");
    };

    window.famobi_onResumeRequested = function() {
        _game.pauseScreen.enabled = false;
        _game.app.timeScale = 1;
        _game.app.fire('Game:unpause');
        famobi.log("Application:resumed");
    };
};

GameController.prototype.enterLobby = function() {
    this.lobbyScreen.enabled = true;
    this.locationController.updateLocation();
};

GameController.prototype.enterRound = function(roundMode) {
    var pauseButton = this.entity.findByName('Pause button'),
        timeToGo = 3,
        
        startInt = setInterval(function () {
            if (this.pauseScreen.enabled)
                return;
            
            if (timeToGo == 1) {
                this.app.fire('Round:start', roundMode);
                clearInterval(startInt);
                this.overlayText.enabled = false;
                this.ballArrow.enabled = (this.roundMode == Conf.TUTORIAL_MODE);
                pauseButton.enabled = (this.roundMode == Conf.ROUND_MODE);
                
                Controllers.soundController.play(Conf.SOUNDS.ROUND_START);
                return;
            }

            this.overlayText.element.text = (--timeToGo);
        }.bind(this), 1000);
    
    this.roundMode = roundMode;
    this.ball.enabled = true;
    this.ingameHud.enabled = (this.roundMode == Conf.ROUND_MODE);
    this.tutorialScreen.enabled = (this.roundMode == Conf.TUTORIAL_MODE);
    this.overlayHud.enabled = true;
    this.overlayText.enabled = true;
    
    this.overlayText.element.text = timeToGo;
    
    if (!this.playerTor)
        this.createPlayerTor();
    
    this.playerTor.rigidbody.teleport(new pc.Vec3(this.roundMode == Conf.ROUND_MODE ? -Conf.INIT_POS.x : 0, 
                                                  Conf.INIT_POS.y, Conf.INIT_POS.z));
    this.playerTor.enabled = true;
    
    if (this.roundMode == Conf.ROUND_MODE) {
        if (!this.aiTor)
            this.createAI();

        this.updateAITexture();
        
        this.aiTor.rigidbody.teleport(new pc.Vec3(Conf.INIT_POS.x, Conf.INIT_POS.y, Conf.INIT_POS.z));
        this.aiTor.enabled = true;
    }
    
    this.app.fire('Round:enter', roundMode);
};

GameController.prototype.exitRound = function(lobby) {
    this.app.timeScale = 1;

    this.app.fire('Round:exit', this.roundMode);

    this.playerTor.enabled = false;
    
    if (this.aiTor)
        this.aiTor.enabled = false;

    this.ingameHud.enabled = false;
    this.overlayHud.enabled = false;
    this.tutorialScreen.enabled = false;

    if (lobby || this.roundMode == Conf.TUTORIAL_MODE)
        this.enterLobby();
    else
        this.scoreController.showProgression();
};

GameController.prototype.createPlayerTor = function() {
    // Create player tor
    this.playerTor = this.torEntity.clone();
    this.playerTor.name = Conf.TOR_PLAYER;
    this.torEntity.parent.addChild(this.playerTor);
    
    this.playerTor.script.create("tapResponder", { 
        attributes: { 
            linearVelocity: Conf.LINEAR_VELOCITY,
            bindTo: "input"
        }
    });
    
    this.playerTor.script.create("arrow", {
        
    });
};

GameController.prototype.createAI = function() {
    this.aiTor = this.torEntity.clone();
    this.aiTor.name = Conf.TOR_AI;
    this.torEntity.parent.addChild(this.aiTor);
    
    this.aiTor.script.create("bot", {
        attributes: {
            ball: this.ball
        }
    });
    
    this.aiTor.script.create("tapResponder", { 
        attributes: { 
            linearVelocity: Conf.LINEAR_VELOCITY,
            bindTo: "bot"
        }
    });
    
    this.aiTor.script.create("opponentInfo", {
        
    });
};

GameController.prototype.updateAITexture = function() {
    var skins = SkinController.getInstance().getSkinsByType(SkinController.SKIN_TYPES.HOOP),
        index = Utils.getRandomIndex(skins),
        texture = skins[index].getTexture(),
        material = this.app.assets.find('Hoop AI', 'material'),
        playerTexture = this.customisation.getPlayerTexture();
    
    if (texture.id == playerTexture.id)
        texture = skins[++index % skins.length].getTexture();
    
    material.resource.diffuseMap = texture.resource;
    material.resource.emissiveMap = texture.resource;
    material.resource.update();
    
    this.aiTor.script.tor.material = material;
};