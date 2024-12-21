var Conf = {};

Conf.STORAGE_KEYS = { GAME_MODE: 'gm',
                      ACTIVE_TEXTURES: 'at',
                      TUTORIAL: 'ttr',
                      GEMS: 'gn',
                      USED_FLAGS: 'ps',
                      TOURNAMENT: 'tment',
                      ROUND: 'rnd',
                      UNLOCKED_SKINS: 'usk',
                      PURCHASE_COUNT: 'pcnt',
                      SOUND: 'snd',
                      
                      TOTAL_SCORE: 'tsc',
                      TOTAL_GAMES_WON: 'atgw',
                      TOTAL_GAMES_LOST: 'atgl',
                      TOP_LEVEL_LEADERBOARD: 'atll',
                      COLLECT_GEMS: 'acg',
                      GEMS_REPORTED: 'agr' };

Conf.ACHIEVEMENTS = { TOTAL_GAMES_WON: 'total_games_won',
                      TOTAL_TOURNAMENT_WON: 'total_tournament_won',
                      TOTAL_GAMES_LOST: 'total_games_lost',
                      TOP_LEVEL_LEADERBOARD: 'top_level_leaderboard',
                      COLLECT_BALL_ALL: 'collect_ball_all',
                      UNLOCK_SKINS_ALL: 'unlock_skins_all',
                      UNLOCK_SKINS_BALL: 'unlock_skins_ball',
                      UNLOCK_SKINS_HOOP: 'unlock_skins_hoop',
                      COLLECT_GEMS: 'collect_gems' };

Conf.GAME_MODES = { DOUBLE: 'double',
                    SINGLE: 'single' };

Conf.GAME_MODE = Utils.getStorageItem(Conf.STORAGE_KEYS.GAME_MODE) || Conf.GAME_MODES.DOUBLE;

Conf.SOUNDS = { APPLY_SKIN: 'Apply skin',
                BALL_DISAPPEAR: 'Ball disappear',
                BOX_APPEAR: 'Box appear',
                BOX_OPEN: 'Box open',
                BOX_REWARD_APPEAR: 'Box reward appear',
                BUTTON_PRESS: 'Button press',
                EARN_GEM: 'Earn gem',
                GEM_APPEAR: 'Gem appear',
                HOOP_JUMP: 'Hoop jump',
                LEVEL_WIN: 'Level win',
                POPUP_CLOSE: 'Popup close',
                POPUP_OPEN: 'Popup open',
                POPUP_SWIPE: 'Popup swipe',
                PROGRESS_LOSS: 'Progress loss',
                PROGRESS_WIN: 'Progress win',
                ROUND_START: 'Round start',
                SCORE_POINT_FINAL: 'Score point final',
                SCORE_POINT: 'Score point',
                SKIN_UNLOCKED: 'Skin unlocked' };

Conf.LINEAR_VELOCITY = [1.1, 3.2, 0];
Conf.INIT_POS = new pc.Vec3(0.75, -0.8, 0);

Conf.TOR_PLAYER = 'Tor:player';
Conf.TOR_AI = 'Tor:ai';

Conf.ROUND_MODE = "Round";
Conf.TUTORIAL_MODE = "Tutorial";

Conf.FIRST_ROUND    = 1;
Conf.QUARTER_FINAL  = 2;
Conf.SEMI_FINAL     = 3;
Conf.FINAL          = 4;

Conf.AD_FADE_OUT_TIME = 1000;

Conf.GEMS_BY_ROUND = [0, 50, 0, 200];
Conf.GEMS_BY_AD = 100;

Conf.LBOX_COMPENSATION = 100;
Conf.MINI_LBOX_COMPENSATION = 50;

Conf.LBOX_ITEM_PROBABILITY = 0.1;
Conf.MINI_LBOX_ITEM_PROBABILITY = 0.05;

Conf.BENCHMARK_OUTCOME = { 3:  [55, 50],
                           5:  [52, 48],
                           7:  [48, 40],
                           10: [40, 25],
                           12: [25, 25] };