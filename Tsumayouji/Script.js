//#region ゲーム開始前に行うこと
//enchant.jsを使うためのメソッド
enchant();
//ゲーム画面に焦点を当てる
//これが無いとPC版は操作できない
window.focus();
//Safariでもサウンドが鳴るようにする(これが無くても鳴るのだけど...)
enchant.Sound.enabledInMobileSafari = true;
//PCでログインしているか否か
var isPC = false; //PCかどうかを判断している変数
//PC以外の端末
var regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
//PCでログインしていた場合はisPCが真
if (window.navigator.userAgent.search(regexp) !== -1) {
    console.log("モバイル端末です");
} else {
    console.log("モバイル端末ではないです");
    isPC = true;
}
//#endregion
//------------------------------
//#region グローバル変数宣言
//スプライトの名前を変数に代入するための配列
let _spritesArray = new Array();
//サウンドの名前を変数に代入するための配列
let _soundsArray = new Array();
//ゲームオブジェクト
let game;
//プレイヤー
let player;
//ボス
let boss;
//#region グループ変数
//今思うと配列にして一斉管理できるようにしておけば良かったと後悔
//プレイヤーグループ
let playerGroup = new Group();
//敵グループ
let enemys = new Group();
//アイテムグループ
let items = new Group();
//エネミーショットグループ
let enemyShoots = new Group();
//ブーメラングループ
let boomerangs = new Group();
//リーフシールドグループ
let leafShilds = new Group();
//プレイヤーショットグループ
let playerShoots = new Group();
//エフェクトグループ
let effects = new Group();
//背景の雲グループ
let backgroundFogs = new Group();
//UIグループ
let UIsBack = new Group();
let UIs = new Group();
//#endregion
//ショタアイテムのUI格納用配列
let _syotaItemUI = new Array();
//スコア
let score = 0;
//敵のレベル
let levelControl = 1;

//ボス難易度
let bossLevel = -1;
//エクストリームをクリアしたかどうか
let s_isExtremeClear = 0;
//ローカルストレージにある保存された値を代入
//前にExtremeに勝利していれば1を返す
s_isExtremeClear = window.localStorage.getItem("isExtremeClear");

//#endregion
//#region 定数
//ゲームバージョン
const GAME_VER = "2.00";
//画面サイズ
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 850;
//プレイ画面幅
const SCREEN_HEIGHT_GAME = 850;
//ノーマルモードでどの程度スコアが溜まったらレベルが上がるのか
const LEVEL_DESIGN = 3000;
//プレイヤーや敵の画面限界座標
const MIN_X = 50;
const MAX_X = SCREEN_WIDTH - MIN_X;
//fps
const GAME_FPS = 30;
//ゲームURL
const GAME_URL = encodeURI("[ http://u0u1.net/oV2C ]");
//プレイヤーの素早さにかかる値
//今思うと定数である必要性はなかったかも
const PLAYER_SPEED_FACTOR = 4;
//HPバーの横と縦の長さ
const HP_BAR_WIDTH = 400;
const HP_BAR_HEIGHT = 30;
//#region デバッグ用
//当たり判定の可視化
const IS_VISIBLE_HIT_RANGE = false;
//プレイヤーを無敵にしておくか否か
const IS_PLAYER_INVINCIVLE = false;
//#endregion

//#endregion
//画像ナンバー
/*
区別がつきやすいように全てに名前をつけている
少し手間だが、これの方がまとめやすい
値は0から連続な値を代入。後に配列で使いやすいようにしている
*/
const SPRITES_NUMBER = {
    TITLE_SPRITE: 0,
    PLAYER_SPRITE: 1,
    LEAFVILLAN_SPRITE: 2,
    PURPLE_SHOOT: 3,
    BLUE_SHOOT: 4,
    PLAYER_HIT_RANGE: 5,
    YELLOW_SHOOT: 6,
    GOLILLA_ITEM: 7,
    BANANA: 8,
    FUTOMOMO_ITEM: 9,
    FUTOMOMO_SHOOT: 10,
    ORANGE_ITEM: 11,
    ORANGE_SHOOT: 12,
    FUTOMOMO_BOMB_HIT_RANGE: 13,
    FUTOMOMO_EFFECT: 14,
    ORANGE_EFFECT: 15,
    BANANA_EFFECT: 16,
    SYOTA_ITEM_SHOOT: 17,
    SYOTA_ITEM_UI: 18,
    PLAYER_RIBBON: 19,
    BACKGROUND_BOTTOM: 20,
    TEXT_FRAME: 21,
    TUTORIAL: 22,
    BACKGROUND_FOG: 23,
    SHOCKWAVE: 24,
    READY_START: 25,
    COPY_RIGHT: 26,
    BOSS_STRAIGHT: 27,
    BOSS_BOOMERANG: 28,
    BOSS_LEAF_SHILD: 29,
    BOSS_LEAF_SHOOT: 30,
    BOSS_HORMING: 31,
    BOSS_BIG_SHOOT: 32,
    BOSS_SPREAD_SHOOT: 33,
    BOSS_SWING_SHOOT: 34,
    PLAYER_HEART: 35,
    BACKGROUND_STAR: 36,
    PULL_SHOOT: 37,
    PULL_ITEM: 38,
    SOUND_PLAY_BUTTON: 39,
    SOUND_STOP_BUTTON: 40,
    SOUND_SCROLL_BUTTON: 41,
    UI_BACK_BUTTON: 42,
};
//音ナンバー
const SOUNDS_NUMBER = {
    //音関係まとめる
    NORMAL_BGM: 0,
    MIDDLE_BOSS_BGM: 1,
    TITLE_BGM: 2,
    GAMEOVER_BGM: 3,
    BOSS_FANFARE: 4,

    ICE_DESTROY: 5,
    BANANA_SHOOT: 6,
    FUTOMOMO_SHOOT: 7,
    BLUE_SHOOT: 8,
    YELLOW_SHOOT: 9,
    PURPLE_SHOOT: 10,
    FUTOMOMO_BOMB: 11,
    INVINCIBLE_BGM: 12,
    ITEM_GET: 13,
    SYOTA_GET: 14,
    SYOTA_CONMPLEAT: 15,
    PLAYER_DAMAGE: 16,
    ORANGE_EDGE: 17,
    ENEMY_DESTROY: 18,
    BOSS_THREE_WAY: 19,
    BOSS_BOOMERANG: 20,
    BOSS_DIVISION_SHOOT: 21,
    BOSS_DIVISION_BOMB: 22,
    BOSS_LEAFSHILD: 23,
    BOSS_NORMAL_SHOOT: 24,
    BOSS_SWING_SHOOT: 25,
    ICE_CREATE: 26,
};
//画像関係読み込み
/*
先ほど宣言した画像ナンバー定数を使って配列に画像のリンクを代入
画像名を連番にすれば配列で一気に回して代入できるが、汎用性はないので１つ１つ代入する形で
最後に全てを読み込んでいる
*/
function SpritesLoad() {
    //爪楊枝
    _spritesArray[SPRITES_NUMBER.TITLE_SPRITE] = "Sprites/Title.png";
    _spritesArray[SPRITES_NUMBER.PLAYER_SPRITE] = "Sprites/toothpick.png";
    _spritesArray[SPRITES_NUMBER.LEAFVILLAN_SPRITE] = "Sprites/leafvillan.png";
    _spritesArray[SPRITES_NUMBER.PURPLE_SHOOT] = "Sprites/purpleShoot.png";
    _spritesArray[SPRITES_NUMBER.BLUE_SHOOT] = "Sprites/buleShoot.png";
    _spritesArray[SPRITES_NUMBER.PLAYER_HIT_RANGE] =
        "Sprites/toothpickHitrange.png";
    _spritesArray[SPRITES_NUMBER.YELLOW_SHOOT] = "Sprites/yellowShoot.png";
    _spritesArray[SPRITES_NUMBER.GOLILLA_ITEM] = "Sprites/gorilla.png";
    _spritesArray[SPRITES_NUMBER.BANANA] = "Sprites/BANANA.png";
    _spritesArray[SPRITES_NUMBER.FUTOMOMO_ITEM] = "Sprites/hutomomo.png";
    _spritesArray[SPRITES_NUMBER.FUTOMOMO_SHOOT] = "Sprites/foot.png";
    _spritesArray[SPRITES_NUMBER.ORANGE_ITEM] = "Sprites/orange.png";
    _spritesArray[SPRITES_NUMBER.ORANGE_SHOOT] = "Sprites/orangeShoot.png";
    _spritesArray[SPRITES_NUMBER.FUTOMOMO_BOMB_HIT_RANGE] =
        "Sprites/futomomoHitRange.png";
    _spritesArray[SPRITES_NUMBER.FUTOMOMO_EFFECT] = "Sprites/FutomomoBomb.png";
    _spritesArray[SPRITES_NUMBER.ORANGE_EFFECT] = "Sprites/ice.png";
    _spritesArray[SPRITES_NUMBER.BANANA_EFFECT] = "Sprites/BANANA.png";
    _spritesArray[SPRITES_NUMBER.SYOTA_ITEM_SHOOT] = "Sprites/Syota.png";
    _spritesArray[SPRITES_NUMBER.SYOTA_ITEM_UI] = "Sprites/syotaUI.png";
    _spritesArray[SPRITES_NUMBER.PLAYER_RIBBON] = "Sprites/toothpickRibbon.png";
    _spritesArray[SPRITES_NUMBER.BACKGROUND_BOTTOM] =
        "Sprites/backGroundBottom.png";
    _spritesArray[SPRITES_NUMBER.TEXT_FRAME] = "Sprites/textFrame.png";
    _spritesArray[SPRITES_NUMBER.TUTORIAL] = "Sprites/tutorial.png";
    _spritesArray[SPRITES_NUMBER.BACKGROUND_FOG] = "Sprites/fog/fogSprite.png";
    _spritesArray[SPRITES_NUMBER.SHOCKWAVE] = "Sprites/shockwave.png";
    _spritesArray[SPRITES_NUMBER.READY_START] = "Sprites/Ready_Start.png";
    _spritesArray[SPRITES_NUMBER.COPY_RIGHT] = "Sprites/copyRight.PNG";
    _spritesArray[SPRITES_NUMBER.BOSS_STRAIGHT] = "Sprites/Boss/straight.PNG";
    _spritesArray[SPRITES_NUMBER.BOSS_BOOMERANG] = "Sprites/Boss/boomerang.png";
    _spritesArray[SPRITES_NUMBER.BOSS_LEAF_SHILD] =
        "Sprites/Boss//leafShild.png";
    _spritesArray[SPRITES_NUMBER.BOSS_LEAF_SHOOT] =
        "Sprites/Boss/leafShoot.png";
    _spritesArray[SPRITES_NUMBER.BOSS_HORMING] = "Sprites/Boss/bossHorming.png";
    _spritesArray[SPRITES_NUMBER.BOSS_BIG_SHOOT] =
        "Sprites/Boss/bossBigShoot.png";
    _spritesArray[SPRITES_NUMBER.BOSS_SPREAD_SHOOT] =
        "Sprites/Boss/bossSpreadShoot.png";
    _spritesArray[SPRITES_NUMBER.BOSS_SWING_SHOOT] =
        "Sprites/Boss/bossKunekune.png";
    _spritesArray[SPRITES_NUMBER.PLAYER_HEART] = "Sprites/Boss/playerHeart.png";
    _spritesArray[SPRITES_NUMBER.BACKGROUND_STAR] = "Sprites/Boss/backStar.png";

    _spritesArray[SPRITES_NUMBER.PULL_SHOOT] = "Sprites/pullShoot.png";
    _spritesArray[SPRITES_NUMBER.PULL_ITEM] = "Sprites/pullItem.png";
    _spritesArray[SPRITES_NUMBER.SOUND_PLAY_BUTTON] =
        "Sprites/sound/playButton.png";
    _spritesArray[SPRITES_NUMBER.SOUND_STOP_BUTTON] =
        "Sprites/sound/stopButton.png";
    _spritesArray[SPRITES_NUMBER.SOUND_SCROLL_BUTTON] =
        "Sprites/sound/scrollButton.png";
    _spritesArray[SPRITES_NUMBER.UI_BACK_BUTTON] =
        "Sprites/sound//backButton.png";
    //画像を全て読み込ませる
    for (var i = 0; i < _spritesArray.length; i++) {
        game.preload([_spritesArray[i]]);
    }
}
//音関係読み込み
//今思うとBGMとSEで分けた方がよかった
function SoundsLoad() {
    _soundsArray[SOUNDS_NUMBER.NORMAL_BGM] = "Music/normal.mp3";
    _soundsArray[SOUNDS_NUMBER.MIDDLE_BOSS_BGM] = "Music/middleBoss.mp3";
    _soundsArray[SOUNDS_NUMBER.TITLE_BGM] = "Music/title.mp3";
    _soundsArray[SOUNDS_NUMBER.ORANGE_EDGE] = "SE/orangeEdge.mp3";
    _soundsArray[SOUNDS_NUMBER.ICE_CREATE] = "SE/iceCreate.wav";
    _soundsArray[SOUNDS_NUMBER.ICE_DESTROY] = "SE/iceDestroy.mp3";
    _soundsArray[SOUNDS_NUMBER.BANANA_SHOOT] = "SE/BANANAShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.FUTOMOMO_SHOOT] = "SE/futomomoShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.BLUE_SHOOT] = "SE/blueShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.YELLOW_SHOOT] = "SE/yellowShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.PURPLE_SHOOT] = "SE/purpleShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.FUTOMOMO_BOMB] = "SE//futomomoBomb.mp3";
    _soundsArray[SOUNDS_NUMBER.INVINCIBLE_BGM] = "Music/invincible.mp3";
    _soundsArray[SOUNDS_NUMBER.ITEM_GET] = "SE/BANANAget.mp3";
    _soundsArray[SOUNDS_NUMBER.SYOTA_GET] = "SE/jump.mp3";
    _soundsArray[SOUNDS_NUMBER.SYOTA_CONMPLEAT] = "SE/shine.mp3";
    _soundsArray[SOUNDS_NUMBER.PLAYER_DAMAGE] = "SE/BANANAfall.mp3";
    _soundsArray[SOUNDS_NUMBER.GAMEOVER_BGM] = "Music/gameover.mp3";
    _soundsArray[SOUNDS_NUMBER.ENEMY_DESTROY] = "SE/enemyDestroy.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_THREE_WAY] = "SE/Boss/3way.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_BOOMERANG] = "SE/Boss/boomerang.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_DIVISION_SHOOT] =
        "SE/Boss/divisionShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_DIVISION_BOMB] =
        "SE/Boss/divisionShootBomb.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_LEAFSHILD] = "SE/Boss/leafShild.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_NORMAL_SHOOT] = "SE/Boss/normalShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_SWING_SHOOT] = "SE/Boss/swingShoot.mp3";
    _soundsArray[SOUNDS_NUMBER.BOSS_FANFARE] = "Music/fanfare.mp3";
    //音を全て読み込ませる
    for (var i = 0; i < _soundsArray.length; i++) {
        game.preload([_soundsArray[i]]);
    }
}

//リーフヴィランの色まとめ
const LEAF_VILLAN_COLOR = {
    GREEN: 0,
    YELLOW: 1,
    BLUE: 2,
    PURPLE: 3,
    BOSS: 4,
};
//addEventListnerで呼び出せるイベント。今更ながら公式が設定してる定数あるので必要なかった
const EVENT = {
    TOUCH_START: "touchstart",
    TOUCH_MOVE: "touchmove",
    TOUCH_END: "touchend",
    ENTER_FRAME: "enterframe",
    EXIT_FRAME: "exitframe",
};
//エフェクトの種類。結局FUTOMOMOしかつかっていない...
const EFFECT_KIND = {
    BANANA: 0,
    ORANGE: 1,
    FUTOMOMO: 2,
};
//アイテム判別ID
const ITEM_ID = {
    GORILLA: 0,
    FUTOMOMO: 1,
    ORANGE: 2,
    SYOTA: 3,
    PULL: 4,
};
//ゲームモード、いまは2種類
const GAME_MODE = {
    NORMAL: 0,
    BOSS_BATTLE: 1,
};

//ボスの難易度定数
const BOSS_LEVEL = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    EXTREME: 3,
    HAGEKASU: 4,
};
//#endregion
//#region クラス宣言------------------------------------
//色関係を利用するためのクラス
class Color {
    //初期値
    constructor() {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1;
    }
    //オブジェクトした際に呼び出すためのメソッド
    //静的メソッドと違ってメンバ変数への代入が含まれている
    rgb(_r, _g, _b) {
        this.Assignment(_r, _g, _b, 1);
        var _rt = "rgb(" + _r + "," + _g + "," + _b + ")";
        return _rt;
    }
    rgba(_r, _g, _b, _a) {
        this.Assignment(_r, _g, _b, _a);
        var _rt = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
        return _rt;
    }
    //こっちは結局未完成のまま終わってしまった。そもそもこのClassの使い道自体が少ない
    color() {
        var _rt = "rgb(" + _r + "," + _g + "," + _b + ")";
        return _rt;
    }
    colora() {
        var _rt = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
        return _rt;
    }
    //こちらは静的メソッド。毎回オブジェクト化しなくても使えるので便利
    //rgb
    static rgb(_r, _g, _b) {
        var _rt = "rgb(" + _r + "," + _g + "," + _b + ")";
        return _rt;
    }
    //rgba
    static rgba(_r, _g, _b, _a) {
        var _rt = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
        return _rt;
    }
    //代入
    Assignment(_r, _g, _b, _a) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }
}
//フォントセットクラス、今の所メイリオだけ
//もうちょい汎用性高めたいけど、どうしよう...
class Font {
    constructor() {
        this.size = 0;
    }
    //サイズを代入してメイリオのフォントを生成
    static SetMeiryo(_size) {
        var _rt = `${_size}px Meiryo`;
        return _rt;
    }
}
//ランダムで数値を返すメソッドをまとめたクラス
class Rand {
    //引数の中から1つをランダムに選ぶ
    static Choose() {
        //引数を配列に代入
        var args = Array.from(arguments);
        //引数の数に応じてランダムな整数値を返す
        var random_dir = Math.floor(this.RandomRange(0, args.length));
        //決定した値を返す
        return args[random_dir];
    }
    //範囲を指定してランダムの値を返す
    static RandomRange(_randMin, _randMax) {
        var _randomRange = Math.random() * (_randMax - _randMin) + _randMin;
        return _randomRange;
    }
    //範囲を指定してランダムな整数値を返す
    static IntRandomRange(_randMin, _randMax) {
        var _randomRange = Math.floor(
            Math.random() * (_randMax - _randMin) + _randMin
        );
        return _randomRange;
    }
}
//Gamemanaer、今回はうまく使いこなせなかった感
class GameManagerClass {
    //初期値
    constructor() {
        this.retryNum = 0;
        this.nowBGM = undefined;
    }
    //敵の数を取得、今回は使ってない
    GetEnemys() {
        return enemys.childNode.length;
    }
    //アップデート。無敵状態の場合常に無敵にする
    GameManagerUpdate() {
        this.TouchCheck();
        if (IS_PLAYER_INVINCIVLE == true) {
            game.isPlayerInvincivle = true;
        }
    }
    //画面をタッチしているかしていないかをチェック
    TouchCheck() {
        game.activeScene.addEventListener(EVENT.TOUCH_START, function () {
            game.isTouch = true;
        });
        game.activeScene.addEventListener(EVENT.TOUCH_END, function () {
            game.isTouch = false;
        });
    }
}
//ベクタークラス
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//#region 背景色
//通常色グラデーション
const BACKGROUND_COLOR_NORMAL = {
    START: Color.rgb(100, 180, 253),
    END: Color.rgb(146, 231, 255),
};
//リザルト
const BACKGROUND_COLOR_RESULT = {
    START: Color.rgb(109, 129, 192),
    END: Color.rgb(218, 196, 232),
    BOSS_START: Color.rgb(150, 220, 0),
    BOSS_END: Color.rgb(245, 255, 30),
};
//Boss戦
const BACKGROUND_COLOR_BOSS = {
    END: Color.rgb(0, 100, 255),
    START: Color.rgb(0, 60, 255),
};
//#endregion
/*オブジェクトに継承させるクラス
Remove:削除命令
Destroy:削除された時に呼ばれるメソッド
MoveToDiraction:指定した角度に飛ばす
MoveToForward:向いている方向に飛ばす
MoveTowardsPoint:指定した座標の方向へ飛ばす
MoveTowardsPointFrame:指定した座標の方向へframe数かけて移動する
IsScreenInside:画面の中にいるかどうか、画面内ならtrue
RotetaSprite:画像の回転
*/
var InstanceObject = enchant.Class.create(enchant.Sprite, {
    //初期化、引数には
    initialize: function (x, y) {
        enchant.Sprite.call(this, x, y);
        this.name = "noName";
        //1フレーム前の座標
        this.previousVector = new Vector(this.x, this.y);
        //現在の座標
        this.nowVector = new Vector(this.x, this.y);
        //速度
        this.speed = 0;
        //MoveTowarsPointに使うための変数
        this.moveTowarsCount = 0;
        this.moveTowarsPreviousCount = 0;
        this.moveTowardsStartX = this.x;
        this.moveTowardsStartY = this.y;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            //速度計算
            this.GetSpeed();
            if (this.moveTowarsCount == this.moveTowarsPreviousCount) {
                this.moveTowarsCount = 0;
            }
            this.moveTowarsPreviousCount = this.moveTowarsCount;
        });
    },
    //削除命令
    Remove: function () {
        this.Destroy();
        //現在のシーンから外す
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        //メモリ解放
        delete this;
    },
    //死亡時に呼び出されるメソッド
    //親クラスでは何も記述しない
    Destroy: function () {},
    //指定した角度に飛ばす
    MoveToDirection: function (_speed, _direction) {
        var rad = _direction * (Math.PI / 180.0);
        this.x += Math.cos(rad) * _speed;
        this.y += Math.sin(rad) * _speed;
    },
    //向いている方向に飛ばす
    MoveToForward: function (_distance) {
        /*
            進みたい距離を_distance、向いている方向を_directionとすると、
            半径_distanceの円の中心から_direction方向にある円周上の点を求める事と等しい
        */
        var rad = this.rotation * (Math.PI / 180.0);
        this.x += Math.cos(rad) * _distance;
        this.y += Math.sin(rad) * _distance;
    },
    //指定した座標の方向へ飛ばす
    MoveTowardsPoint: function (_moveX, _moveY, _speed) {
        this.moveTowarsCount++;
        //初期移動時のフレームで初期値を代入
        if (this.moveTowarsCount == 1) {
            this.moveTowardsStartX = this.x;
            this.moveTowardsStartY = this.y;
        }
        var rad = Math.atan2(
            _moveY - this.moveTowardsStartY,
            _moveX - this.moveTowardsStartX
        );
        this.x += Math.cos(rad) * _speed;
        this.y += Math.sin(rad) * _speed;
    },
    //目的の方向へframeかけて移動
    MoveTowardsPointFrame: function (_moveX, _moveY, _frame) {
        this.x += (_moveX - this.x) / _frame;
        this.y += (_moveY - this.y) / _frame;
    },
    //画面内にいるかどうか、いたらtrue
    IsScreenInside: function () {
        var _rt = true;
        if (
            this.x < -50 ||
            this.x > SCREEN_WIDTH + 50 ||
            this.y < 0 ||
            this.y + this.height > SCREEN_HEIGHT_GAME
        ) {
            _rt = false;
        }
        return _rt;
    },
    //画像を回転させる
    RotateSprite: function (_rotateSpeed, _rotateDirection) {
        this.rotation += _rotateSpeed * _rotateDirection;
    },
    //speed変数取得
    GetSpeed: function () {
        //1つ前のフレームと今のフレームの距離を計算して現在の速度を求める
        this.nowVector = new Vector(this.x, this.y);
        this.speed = PoindDistance(
            this.previousVector.x,
            this.previousVector.y,
            this.nowVector.x,
            this.nowVector.y
        );
        this.previousVector = new Vector(this.x, this.y);
        return this.speed;
    },
});

//#region プレイヤー関係
//プレイヤークラス
var Player = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 5, 96);
        this.name = "プレイヤー";
        this.moveTo(x, y);
        //中心の座標
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
        //タッチ時の座標
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PLAYER_SPRITE]];
        //横当たり判定の範囲
        this.hitRangeX = 2;
        //ゲームオーバー演出用カウント
        this.gameoverCount = 0;
        //タッチしたかどうか
        this.isTouch = false;
        //タッチ開始時
        game.activeScene.addEventListener(EVENT.TOUCH_START, function (touch) {
            if (game.isStopGame == false) {
                //タッチ座標とタッチ時のプレイヤーの座標を代入
                game.touchStartX = touch.x;
                game.touchStartY = touch.y;
                player.touchStartX = player.x;
                player.touchStartY = player.y;
                player.isTouch = true;
            }
        });
        //タッチ移動中
        game.activeScene.addEventListener(EVENT.TOUCH_MOVE, function (touch) {
            if (game.isStopGame == false && player.isTouch == true) {
                //タッチ座標から指を動かすと、それに合わせてプレイヤーも動く
                var moveX = touch.x - game.touchStartX;
                var moveY = touch.y - game.touchStartY;
                if (game.isStopGame == false) {
                    //初期のタッチ位置から移動させる
                    player.x = player.touchStartX + moveX * PLAYER_SPEED_FACTOR;
                    player.y = player.touchStartY + moveY * PLAYER_SPEED_FACTOR;
                }
                //限界を超えない
                player.Limited();
            }
        });
        //タッチを離した時
        game.activeScene.addEventListener(EVENT.TOUCH_END, function (touch) {
            //player.x = touch.x - player.width / 2;
            player.isTouch = false;
        });
        //1フレームごとに呼び出される(Update)
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.centerX = this.x + this.width / 2;
            this.centerY = this.y + this.height / 2;
            //当たり判定の座標を合わせる
            for (var i = 0; i < 3; i++) {
                this.hitRange[i].moveTo(this.x, this.y + i * 32);
            }
            //Enemyとの当たり判定
            //this.CollisionEnemy();
            for (var i = 0; i < enemys.childNodes.length; i++) {
                if (
                    this.PlayerCollisionObjects(30, enemys.childNodes[i]) ==
                    true
                ) {
                    if (game.isPlayerInvincivle == false) {
                        this.GameOver();
                    }
                }
            }
        });

        //プレイヤーグループに生成
        playerGroup.addChild(this);
        //当たり判定生成
        this.CreateHitRange();
    },
    //当たり判定設置
    CreateHitRange: function () {
        //当たり判定を3つに分けている
        this.hitRange = new Array();
        for (var i = 0; i < 3; i++) {
            this.hitRange[i] = new Sprite(5, 32);
            this.hitRange[i].image =
                game.assets[_spritesArray[SPRITES_NUMBER.PLAYER_HIT_RANGE]];
            this.hitRange[i].visible = IS_VISIBLE_HIT_RANGE;
            this.hitRange[i].moveTo(this.x, this.y + i * 32);
            game.activeScene.addChild(this.hitRange[i]);
        }
    },
    //移動の限界値設定
    Limited: function () {
        if (this.x < MIN_X - this.width / 2) {
            this.x = MIN_X - this.width / 2;
        }
        if (this.x > MAX_X - this.width / 2) {
            this.x = MAX_X - this.width / 2;
        }
        if (this.y < 50) {
            this.y = 50;
        }
        if (this.y > SCREEN_HEIGHT_GAME - this.height) {
            this.y = SCREEN_HEIGHT_GAME - this.height;
        }
    },
    //敵との接触判定
    CollisionEnemy: function () {
        var _rt = false;
        for (var i = 0; i < enemys.childNodes.length; i++) {
            for (var j = 0; j < 3; j++) {
                //距離を25で一定にしているが、本来なら変数か何かで敵ごとに決めた方が良さそう
                if (this.hitRange[j].within(enemys.childNodes[i], 25)) {
                    if (game.isPlayerInvincivle == false) {
                        _rt = true;
                        game.GameOverScene = new GameOverScene();
                    }
                }
            }
        }
        return _rt;
    },
    //ゲームオーバー時の処理
    GameOver: function () {
        if (game.isStopGame == false) {
            game.isStopGame = true;
            //ゲームオーバー処理呼び出し
            var gameover = new PlayerGameOver();
        }
    },
    //プレイヤーとの当たり判定を判断
    //_distanceのそのオブジェクトとの距離を代入
    PlayerCollisionObjects: function (_distance) {
        //引数を配列に代入
        var _rt = false;
        //引数として送られてきたオブジェクトを入れるとして代入
        var _objects = Array.from(arguments);
        //当たり判定チェック
        for (var i = 1; i < _objects.length; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.hitRange[j].within(_objects[i], _distance)) {
                    _rt = true;
                    //game.GameOverScene = new GameOverScene();
                }
            }
        }
        return _rt;
    },
});
//ボス戦時のプレイヤークラス
var BossPlayer = enchant.Class.create(Player, {
    initialize: function (x, y) {
        Player.call(this, x, y);
        this.name = "ボスプレイヤー";
        //ダメージ喰らったときに無敵になる処理で使う変数
        this.isInvincivle = false;
        this.invincivleCount = 0;
        this.invincivleTime = 60;
        this.brindInterval = 3;
        //HP設定
        this.HpInit();
        //ハートマーク表示
        this.hpUIs = new Array(this.hp);
        for (let i = 0; i < this.hpUIs.length; i++) {
            this.hpUIs[i] = new PlayerHeartUI(i * 58 + 20, 800);
        }
        //初期でリボン装備(ボス用)
        this.ribbon = new BossSyotaRibbon(this.x + 3, this.y + 70);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                if (this.isInvincivle == true) {
                    this.InvincivleUpdate();
                }
            }
        });
    },
    //HP初期設定。選択した難易度によってHPが変わる
    //難易度によってHPが減少するので 5 - bossLevel の文だけで実装できるが
    //今後のバランス調整のためにもスイッチ文で分けている
    HpInit: function () {
        switch (bossLevel) {
            case BOSS_LEVEL.EASY:
                this.hp = 5;
                break;
            case BOSS_LEVEL.NORMAL:
                this.hp = 4;
                break;
            case BOSS_LEVEL.HARD:
                this.hp = 3;
                break;
            case BOSS_LEVEL.EXTREME:
                this.hp = 2;
                break;
            case BOSS_LEVEL.HAGEKASU:
                this.hp = 1;
                break;
            default:
                // /エラーログ
                console.log("BossPlayerHpInit");
        }
    },
    //ゲームオーバー時の処理
    /**
     * 同じメソッド名を使っているが、実質ダメージを受けたときの処理に等しい
     * この部分に関しては初期の段階からメソッド名に気をつければよかった
     * 無敵状態ではなければダメージを喰らい、体力を1減らして一定時間無敵モードへと以降
     * HPが0になればそのままゲームオーバーになる
     */
    GameOver: function () {
        if (game.isStopGame == false) {
            if (this.isInvincivle == false) {
                this.hp -= 1;
                this.hpUIs[this.hp].frame = 1;
                this.isInvincivle = true;
                this.invincivleCount = 0;
                PlaySE(_soundsArray[SOUNDS_NUMBER.ENEMY_DESTROY]);
                if (this.hp <= 0) {
                    game.isStopGame = true;
                    //ゲームオーバー処理呼び出し
                    var gameover = new PlayerGameOver();
                }
            }
        }
    },
    /**無敵時のUpdateメソッド
     * 点滅するように処理している
     * リボンも同様に点滅させている
     */
    InvincivleUpdate: function () {
        this.invincivleCount++;
        if (this.invincivleCount % this.brindInterval == 0) {
            if (this.visible == true) {
                this.visible = false;
            } else {
                this.visible = true;
            }
        }

        if (this.invincivleCount > this.invincivleTime) {
            this.visible = true;
            this.isInvincivle = false;
        }
        this.ribbon.visible = this.visible;
    },
});
/**ゲームオーバークラス
 * プレイヤーがゲームオーバーになったときに呼ばれるクラス
 */
var PlayerGameOver = enchant.Class.create(InstanceObject, {
    initialize: function () {
        InstanceObject.call(this, 0, 0);
        //カウント変数
        this.count = 0;
        //BGMを止める
        //if (Sound.src) {
        game.assets[game.nowBGM].stop();
        //}
        //効果音再生
        PlaySE(_soundsArray[SOUNDS_NUMBER.PLAYER_DAMAGE]);
        //画面点滅処理
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            //更新
            this.count++;
            this.RedFrash();
            //シーン遷移
            if (this.count == 75) {
                game.GameOverScene = new GameOverScene();
            }
        });

        game.activeScene.addChild(this);
    },
    //赤く点滅させる
    RedFrash: function () {
        if (this.count < 51) {
            //赤と透明に点滅
            if (this.count % 10 == 0) {
                game.activeScene.backgroundColor = Color.rgb(255, 0, 0);
            }
            if (this.count % 20 == 0) {
                game.activeScene.backgroundColor = Color.rgba(255, 0, 0, 0);
            }
        }
    },
});

/**ゲームクリアクラス
 * ボス戦専用で呼ばれる。ボスを倒したときに呼ばれるクラス
 * 中身はゲームオーバークラスと似ている
 * 継承するとちょっとめんどくさそうだったので単体で作った
 * 本来であればリザルトクラスみたいな親クラスを作って継承させるのが一番良さそう
 */
var BossGameClear = enchant.Class.create(InstanceObject, {
    initialize: function () {
        InstanceObject.call(this, 0, 0);
        game.isStopGame = true;
        //カウント変数
        this.count = 0;
        //BGMを止める
        game.assets[game.nowBGM].stop();
        //効果音再生
        PlaySE(_soundsArray[SOUNDS_NUMBER.ORANGE_EDGE]);
        //画面点滅処理
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            //更新
            this.count++;
            this.YellowFrash();
            //シーン遷移
            if (this.count == 75) {
                game.GameClearScene = new GameClearScene();
            }
        });

        game.activeScene.addChild(this);
    },
    //黄色く点滅させる
    YellowFrash: function () {
        if (this.count < 51) {
            //赤と透明に点滅
            if (this.count % 10 == 0) {
                game.activeScene.backgroundColor = Color.rgb(180, 200, 0);
            }
            if (this.count % 20 == 0) {
                game.activeScene.backgroundColor = Color.rgba(180, 200, 0, 0);
            }
        }
    },
});
//#endregion

//#region エネミー関係
/**エネミー親クラス、継承用
 * 基礎的なステータスやヒット判定、削除処理等を設定
 * 氷エフェクトの設置処理などもこちらで設定
 * 今思うとEnemyUpdateって名前を継承先でも使えるようにして、Updateをここで管理した方がよかったと思う
 */
var Enemy = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        //Spriteクラスのコンストラクタを呼び出す
        InstanceObject.call(this, x, y);
        this.leftBoxX = x;
        this.rightBoxX = x + this.width;
        this.topBoxY = y;
        this.bottomBoxY = y + this.height;
        //倒した時に入るスコア、デフォルトは100
        this.enemyScore = 100;
        //氷関係の初期値
        this.IceInit();
        //hp初期値
        this.hp = undefined;
        //毎フレーム実行される
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.EnemyUpdate();
            }
        });
    },
    //氷状態関係の初期値
    IceInit: function () {
        this.isIceFlag = false;
        this.iceTime = 60;
        this.iceCount = 0;
        this.iceEffect = -1;
        this.isIceDestroy = true;
    },
    EnemyUpdate: function () {
        //オブジェクトの四隅の座標
        this.leftBoxX = this.x;
        this.rightBoxX = this.x + this.width;
        this.topBoxY = this.y;
        this.bottomBoxY = this.y + this.height;
        //氷状態が解けた時にエフェクトを消す処理
        if (this.iceEffect != -1) {
            if (this.isIceDestroy == true) {
                this.IceDestroy();
                this.iceEffect = -1;
                this.isIceDestroy = false;
            }
        }

        this.isIceDestroy = false;
    },
    //ダメージを受ける処理
    SendDamage: function (_damage) {
        this.hp -= _damage;
    },
    //氷属性の攻撃を食らった時
    IceDamage: function (_iceFlag) {
        //氷状態ではなくて尚且つ氷属性の攻撃を食らった場合
        if (this.isIceFlag == false && _iceFlag == true) {
            //エフェクトが存在しない場合
            if (this.iceEffect == -1) {
                //エフェクト生成
                this.iceEffect = new EffectOrangeIce(
                    this.x + this.width / 2,
                    this.y + this.height / 2
                );
                //座標設定
                this.iceEffect.x = this.x;
                this.iceEffect.y = this.y;
                //エフェクトが死んだかどうか(この変数いる？)
                this.isIceDestroy = false;
                //凍っている状態にする
                this.isIceFlag = _iceFlag;
            }
        }
        //カウントリセット
        this.iceCount = 0;
    },
    //死ぬときに呼ばれる
    Destroy: function () {
        //氷状態でエフェクトが残っていたら消す
        if (this.isIceFlag == true) {
            if (this.iceEffect != -1) {
                this.IceDestroy();
            }
        }
        //雷エフェクトが存在する場合消す
        if (this.shoot) {
            this.shoot.Remove();
        }
        //最大プラススコアは800
        if (this.enemyScore > 800) {
            this.enemyScore = 800;
        }
        //スコアに加算
        score += this.enemyScore;
    },
    //エフェクトを消す
    IceDestroy: function () {
        this.iceEffect.Remove();
        PlaySE(_soundsArray[SOUNDS_NUMBER.ICE_DESTROY]);
    },
});
/**リーフヴィランクラス
 * このクラスで全てのリーフヴィランの種類の動きを実装しているが
 * 本来であればこれもリーフヴィランの親クラスとして宣言し、
 * それらを継承したそれぞれのリーフヴィランクラスを作るべきである
 */
var LeafVillain = enchant.Class.create(Enemy, {
    initialize: function (x, y, nameColor) {
        //Enemyのコンストラクタ
        Enemy.call(this, 64, 64);
        //座標代入
        this.x = x;
        this.y = y;

        //カウント変数
        this.moveCount = 0;
        //速度変数
        this.moveSpeed = 0;
        //名前番号を登録
        this.nameColor = nameColor;
        //リーフヴィランの画像を入れる
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.LEAFVILLAN_SPRITE]];
        //画像を色に合わせる
        this.frame = this.nameColor;
        this.Init();
        //1フレームごとに呼び出される(Update)
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Update();
            }
        });
        enemys.addChild(this);
    },
    //それぞれ初期化
    Init: function () {
        //緑
        if (this.nameColor == LEAF_VILLAN_COLOR.GREEN) {
            this.GreenInit();
        }
        //黄色
        else if (this.nameColor == LEAF_VILLAN_COLOR.YELLOW) {
            this.YellowInit();
        }
        //青
        else if (this.nameColor == LEAF_VILLAN_COLOR.BLUE) {
            this.BlueInit();
        }
        //青
        else if (this.nameColor == LEAF_VILLAN_COLOR.PURPLE) {
            this.PurpleInit();
        }
    },
    //緑色
    GreenInit: function () {
        //初期角度
        this.rotation = Rand.RandomRange(0, 360);
        //どちらに回るか
        this.rotationDirection = Rand.Choose(-1, 1);
        //落下速度、レベルが上がると早くなる
        this.moveSpeed = Rand.RandomRange(1, 2) + Math.floor(levelControl / 5);
        //重力
        this.gravity = 0;
        //hp、レベルが上がると高くなる。倒しにくいので低め
        this.hp = 5 + Math.floor(levelControl / 7);
        //スコア、レベルが上がると高くなる
        this.enemyScore = 100 + levelControl * 30;
        this.name = "リーフヴィラン(緑)";
    },
    //黄色
    YellowInit: function () {
        //初期角度
        this.rotation = Rand.RandomRange(0, 360);
        //どちらに回るか
        this.rotationDirection = Rand.Choose(-1, 1);
        //初期速度
        this.firstSpeedX =
            Rand.RandomRange(3, 8) + Math.floor(levelControl / 5);
        this.firstSpeedY =
            Rand.RandomRange(2, 4) + Math.floor(levelControl / 10);
        //初期速度代入
        this.moveSpeedX = this.firstSpeedX;
        this.moveSpeedY = this.firstSpeedY;
        //反射フラグ
        this.isReflect = false;
        //アタックカウント変数
        this.attackCount = 0;
        //攻撃時間
        this.attackTime = 60;
        //攻撃中か否か
        this.attack = false;
        //ショット格納変数
        this.shoot;
        //hp レベルに応じて。若干高め
        this.hp = 15 + Math.floor(levelControl / 3);
        //スコア
        this.enemyScore = 150 + levelControl * 40;
        this.name = "リーフヴィラン(黄)";
    },
    //青色
    BlueInit: function () {
        //初期角度
        this.rotation = Rand.RandomRange(0, 360);
        //回転向き
        this.rotationDirection = Rand.Choose(-1, 1);
        //次の移動先
        this.nextX = this.x;
        this.nextY = 150;
        //重力
        this.gravity = 0;
        //止まった回数格納変数
        this.stopCountNum = 0;
        //止まるカウント格納配列
        this.stopCountArray = new Array(5);
        //最初に止まるカウント
        this.stopCountFirst = 20 - Math.floor(levelControl / 8);
        //止まる回数
        this.stopCountTimes = 3 + Math.floor(levelControl / 15);
        //最大値最小値設定
        if (this.stopCountTimes > 6) {
            this.stopCountTimes = 6;
        }

        if (this.stopCountFirst < 5) {
            this.stopCountFirst = 5;
        }
        //落下中か否か
        this.isFallFlag = false;
        //配列に止まるカウントを代入
        for (let i = 0; i < this.stopCountArray.length; i++) {
            this.stopCountArray[i] = this.stopCountFirst * (i + 1);
        }
        //かなり当てにくいのでhpは上がらない
        this.hp = 8;
        //スコアは高め
        this.enemyScore = 250 + levelControl * 50;
        this.name = "リーフヴィラン(青)";
    },
    PurpleInit: function () {
        //初期角度
        this.rotation = Rand.RandomRange(0, 360);
        //回る向き
        this.rotationDirection = Rand.Choose(-1, 1);
        //hpは高め
        this.hp = 12 + Math.floor(levelControl / 3);
        //ショット回数
        this.shootCount = 1 + Math.floor(levelControl / 12);
        //ショット回数カウント変数
        this.shootTime = 0;
        //ショット角度のズレ
        this.shootRotation = Rand.IntRandomRange(0, 45);
        //落ちるフラグ
        this.isFallFlag = false;
        //3回が限界値
        if (this.shootCount > 5) {
            this.shootCount = 5;
        }
        //スコアは高め
        this.enemyScore = 200 + levelControl * 40;
        this.name = "リーフヴィラン(紫)";
    },
    //Update
    Update: function () {
        //氷状態ではない時は動ける
        if (this.isIceFlag == false) {
            //緑
            if (this.nameColor == LEAF_VILLAN_COLOR.GREEN) {
                this.GreenMove();
            }
            //黄色
            else if (this.nameColor == LEAF_VILLAN_COLOR.YELLOW) {
                this.YellowMove();
            }
            //青
            else if (this.nameColor == LEAF_VILLAN_COLOR.BLUE) {
                this.BlueMove();
            }
            //紫
            else if (this.nameColor == LEAF_VILLAN_COLOR.PURPLE) {
                this.PurpleMove();
            }
        }
        //氷状態の時
        else if (this.isIceFlag == true) {
            //カウントが増える
            this.iceCount++;
            if (this.iceCount > this.iceTime) {
                this.isIceFlag = false;
                this.isIceDestroy = true;
            }
        }

        //y座標が画面外に行った時かHPが0の時
        if (this.y + this.height > SCREEN_HEIGHT_GAME) {
            //削除
            this.enemyScore = Math.floor(
                this.enemyScore / Rand.Choose(3, 5, 7, 10)
            );
            this.Remove();
        }
        if (this.hp <= 0) {
            if (this.isIceFlag == false) {
                PlaySE(_soundsArray[SOUNDS_NUMBER.ENEMY_DESTROY]);
            }
            this.Remove();
        }
    },
    //緑色
    GreenMove: function () {
        //重力
        this.gravity += 0.3;
        //だんだん下へ
        this.y += this.moveSpeed + this.gravity;
        //速度に合わせて回転速度が上がる
        this.rotation +=
            this.rotationDirection * (this.moveSpeed + this.gravity);
    },
    //黄色
    YellowMove: function () {
        //カウント変数
        this.moveCount++;
        //攻撃時
        if (this.attack == true) {
            //アタックカウント変数
            this.attackCount++;
            //移動速度を下げる
            this.moveSpeedX /= 1.15;
            this.moveSpeedY /= 1.15;
            //10フレーム目に発射
            if (this.attackCount == 10) {
                this.shoot = new YellowShoot(
                    this.x - this.width / 2,
                    this.y - this.height / 2
                );
                PlaySE(_soundsArray[SOUNDS_NUMBER.YELLOW_SHOOT]);
            }
            //ショットは付いてくるように
            if (this.attackCount > 10) {
                this.shoot.moveTo(
                    this.x - this.width / 2,
                    this.y - this.height / 2
                );
            }
            //60フレーム目に終了
            if (this.attackCount > 60) {
                this.attack = false;
                this.shoot.Remove();
            }
        }
        //攻撃モードに移行する条件
        if (this.attackCount == 0) {
            if (
                PoindDistance(
                    this.x,
                    this.y,
                    player.x,
                    player.y + player.height / 2
                ) <
                165 + Math.floor(levelControl)
            ) {
                this.attack = true;
            }
        }
        //加速
        if (this.attackCount > 60) {
            this.moveSpeedX += (this.firstSpeedX - this.moveSpeedX) / 8;
            this.moveSpeedY += (this.firstSpeedY - this.moveSpeedY) / 8;
        }
        //左か右へ
        this.x += this.moveSpeedX * this.rotationDirection;
        //一定の速度で下へ
        this.y += this.moveSpeedY;
        //移動する向きに合わせて回転の向きも変わる
        this.rotation += 3 * this.rotationDirection * this.moveSpeedX;
        //画面端にいったら折り返す
        if (this.x < 0 || this.x > SCREEN_WIDTH - this.width) {
            if (this.moveCount > 20) {
                this.rotationDirection *= -1;
                this.moveCount = 0;
            }
        }
    },
    //青色
    BlueMove: function () {
        //カウント変数
        this.moveCount++;
        //落下していない時
        if (this.isFallFlag == false) {
            //移動
            if (this.moveCount < this.stopCountArray[this.stopCountNum]) {
                this.MoveTowardsPointFrame(
                    this.nextX,
                    this.nextY,
                    this.stopCountArray[0] / 2
                );
            }
            //ショット
            if (this.moveCount == this.stopCountArray[this.stopCountNum]) {
                var Shoot = new BlueShoot(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    8,
                    90
                );
                PlaySE(_soundsArray[SOUNDS_NUMBER.BLUE_SHOOT]);
                this.nextX = Rand.RandomRange(MIN_X, MAX_X);
                //ショット回数を加算
                this.stopCountNum++;
                //ショット回数が規定の値になった時、落ちるモードに移行
                //そうじゃない場合は繰り返し

                //落下に移行
                if (this.stopCountNum == this.stopCountTimes) {
                    this.moveSpeed = -15;
                    this.nextX = Rand.RandomRange(2, 5) * Rand.Choose(-1, 1);
                    this.isFallFlag = true;
                }
            }
        }
        //落下
        if (this.isFallFlag == true) {
            this.gravity += 0.9;
            this.x += this.nextX;
            this.y +=
                this.moveSpeed + this.gravity + Math.floor(levelControl / 5);
        }
        //回転
        this.rotation += 18 * this.rotationDirection;
    },
    PurpleMove: function () {
        //カウント変数
        this.moveCount += 1;
        //90フレーム後までに指定の座標へ
        if (this.moveCount < 90) {
            this.MoveTowardsPointFrame(this.x, 200, 30);
        }
        //60フレーム後にショット開始
        if (this.moveCount == 60) {
            var randomRot = Rand.IntRandomRange(20, 45);
            for (var i = 0; i < 8; i++) {
                var shoot = new PurpleShoot(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    45 * i +
                        this.shootRotation +
                        (this.shootTime + 1) * randomRot
                );
            }
            PlaySE(_soundsArray[SOUNDS_NUMBER.PURPLE_SHOOT]);
        }
        //落下するかもう一度発射するか判断
        if (this.moveCount == 80) {
            //ショット回数を加算
            this.shootTime++;
            //ショット回数が規定の回数の場合
            if (this.shootTime == this.shootCount) {
                //落下
                this.isFallFlag = true;
            } else {
                //もう一度ショット
                this.moveCount = 30 + this.shootCount * 5;
            }
        }
        //90フレーム後に落下
        if (this.moveCount > 90 && this.isFallFlag) {
            this.y += this.moveSpeed;
            this.moveSpeed += 0.5;
        }
        //とりあえず回転
        this.rotation += 8 * this.rotationDirection;
    },
});
//#endregion

//#region ボス関係
/**ボスクラス
 * 今回はボスが一体の予定だったのでこのままクラスを作ったが
 * 本来はボス親クラスを作った方が良いかもしれない
 */
var LeafVillainBoss = enchant.Class.create(Enemy, {
    initialize: function (x, y) {
        Enemy.call(this, 64, 64);
        this.moveTo(220, 120);
        //リーフヴィランの画像を入れる
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.LEAFVILLAN_SPRITE]];
        this.name = "ボス";
        this.BossInit();
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.Main();
        });
        enemys.addChild(this);
    },
    //初期値
    BossInit: function () {
        //初期の座標を代入
        this.startVec = new Vector(this.x, this.y);
        //移動速度
        this.moveSpeed = new Vector(120, 0);
        //移動半径
        this.radius = 120;
        //拡大
        this.scaleX = 3;
        this.scaleY = 3;
        //中心の座標を入れておく
        this.centerVec = new Vector(this.x + 32, this.y + 96);
        //画像をボスの画像に
        this.frame = LEAF_VILLAN_COLOR.BOSS;
        //アニメーション制御変数
        this.walkAnimationCount = 0;
        this.walkAnimetionTime = 20;
        this.walkSpeed = 0;
        //難易度によって敵の攻撃頻度を変えるための変数
        this.bossLevelAttackAddNum = 0;
        //リーフシールドを貼る体力
        this.firstLeafShildHp = 0;
        //リーフシールドを貼ったかどうか
        this.isFirstLeafShild = false;
        this.isSecondLeafShild = false;
        //レベルの最大値
        this.levelMax = 10;
        //攻撃関係の初期化
        this.AttackInit();
        //難易度によって強さが変わる値の設定
        this.BossLevelControlInit();
    },
    //HP初期値
    HpInit: function (_hp) {
        this.hpBar = new DrawBossHPBar(50, 15);
        this.hp = _hp;
        this.maxHp = this.hp;
    },
    //攻撃関係初期値
    AttackInit: function () {
        this.attackCount = 0;
        //アタックタイムの最低値最大値
        this.randomAttackTimeMin = 30;
        this.randomAttackTimeMax = 60;
        //アタックタイム代入
        this.attackTime = Rand.IntRandomRange(
            this.randomAttackTimeMin,
            this.randomAttackTimeMax
        );
        this.ATTAKC_PATTERN = {
            HORMING_SHOOT: 0,
            BIG_SPREAD_SHOOT: 1,
            SWING_SHOOT: 2,
            CIRCLE_SHOOT: 3,
            THREE_WAY_SHOOT: 4,
        };
    },
    //難易度によって変化する値の設定
    BossLevelControlInit: function () {
        switch (bossLevel) {
            case BOSS_LEVEL.EASY:
                this.bossLevelAttackAddNum = 15;
                this.HpInit(150);
                this.firstLeafShildHp = this.maxHp / 3;
                this.levelMax = 7;
                this.leafShildNum = 2;
                break;
            case BOSS_LEVEL.NORMAL:
                this.bossLevelAttackAddNum = 10;
                this.HpInit(150);
                this.firstLeafShildHp = this.maxHp / 2;
                this.levelMax = 10;
                this.leafShildNum = 3;
                break;
            case BOSS_LEVEL.HARD:
                this.bossLevelAttackAddNum = 5;
                this.HpInit(170);
                this.firstLeafShildHp = this.maxHp / 2;
                this.levelMax = 10;
                this.leafShildNum = 4;
                break;
            case BOSS_LEVEL.EXTREME:
                this.bossLevelAttackAddNum = 0;
                this.HpInit(190);
                this.firstLeafShildHp = (this.maxHp / 3) * 2;
                this.levelMax = 10;
                this.leafShildNum = 4;
                break;
            case BOSS_LEVEL.HAGEKASU:
                this.bossLevelAttackAddNum = -5;
                this.HpInit(200);
                this.firstLeafShildHp = this.maxHp + 1;
                this.levelMax = 12;
                this.leafShildNum = 4;
                break;
            default:
                //エラ〜ログ
                console.log("BossPlayerHpInit");
        }
    },
    //メインループ
    Main: function () {
        if (game.isStopGame == false) {
            this.centerVec = new Vector(this.x + 24, this.y + 36);
            this.AttackUpdate();
            this.HpBarControl();
            this.WalkAnimetion();
            this.LevelControl();
            this.BossDestroy();
        }
    },
    //攻撃パターン
    AttackUpdate: function () {
        this.attackCount++;
        //リーフシールド
        this.LeafShildUpdate();
        //攻撃を行う処理
        //ここまで複雑になることを想定してなかった
        //今思うといくつかメソッドにわけてよかったと思う
        if (this.attackCount == this.attackTime) {
            //技は5つのうちから均等な確率で選ばれる
            var choise = Rand.Choose(0, 1, 2, 3, 4);
            //攻撃
            this.ChooseAttack(choise);
            //二回攻撃するか否か
            //0なら攻撃する
            let isDobleAttack = 1;
            //エクストリーム以上の場合はレベルが7を超えていた場合ランダムで二回攻撃してくる
            if (bossLevel >= BOSS_LEVEL.EXTREME) {
                if (levelControl > 7) {
                    isDobleAttack = Rand.Choose(0, 1);
                }
            }
            //ハード以上の場合、ホーミングショットかスプレッドショットの場合もう一回攻撃する
            if (bossLevel >= BOSS_LEVEL.HARD) {
                if (levelControl >= 5) {
                    if (
                        choise == this.ATTAKC_PATTERN.HORMING_SHOOT ||
                        choise == this.ATTAKC_PATTERN.BIG_SPREAD_SHOOT
                    ) {
                        isDobleAttack = 0;
                    }
                }
            }
            //二回目の攻撃は一回目の攻撃と重ならないように設定
            if (isDobleAttack == 0) {
                var choise2 = 0;
                while (choise == choise2) {
                    choise2 = Rand.Choose(0, 1, 2, 3, 4);
                }
                this.ChooseAttack(choise2);
            }
            //アタックタイムとアタックカウントリセット
            this.attackTime =
                Rand.IntRandomRange(
                    this.randomAttackTimeMin,
                    this.randomAttackTimeMax
                ) +
                this.bossLevelAttackAddNum -
                levelControl;
            this.attackCount = 0;
        }
    },
    //攻撃選択
    ChooseAttack: function (_choise) {
        if (_choise == this.ATTAKC_PATTERN.HORMING_SHOOT) {
            //狙い撃ち
            this.HomingShoot();
        } else if (_choise == this.ATTAKC_PATTERN.BIG_SPREAD_SHOOT) {
            //破裂する弾
            this.BigSpreadShoot();
        } else if (_choise == this.ATTAKC_PATTERN.SWING_SHOOT) {
            //くねくね
            this.SwingShoot();
        } else if (_choise == this.ATTAKC_PATTERN.CIRCLE_SHOOT) {
            //ブーメラン
            this.CircleShoot();
        } else if (_choise == this.ATTAKC_PATTERN.THREE_WAY_SHOOT) {
            //三発飛ばすショット
            this.ThreeWayShoot();
        }
    },
    //リーフシールド更新
    LeafShildUpdate: function () {
        if (this.hp < this.firstLeafShildHp) {
            if (this.isFirstLeafShild == false) {
                this.LeafShildCreate(135, 0, this.leafShildNum);
                this.isFirstLeafShild = true;
            }
        }
        if (bossLevel >= BOSS_LEVEL.HAGEKASU) {
            if (this.hp < this.maxHp / 2) {
                if (this.isSecondLeafShild == false) {
                    this.LeafShildCreate(350, 110, this.leafShildNum);
                    this.isSecondLeafShild = true;
                }
            }
        }
    },
    //HPバー
    HpBarControl: function () {
        this.hpBar.r = 255 - (this.hp * 255) / this.maxHp;
        this.hpBar.g = (this.hp * 255) / this.maxHp;
        this.hpBar.barWidth = (this.hp * HP_BAR_WIDTH) / this.maxHp;
    },
    //歩きのアニメーション
    WalkAnimetion() {
        this.walkAnimationCount += 1 + levelControl / 4;
        this.walkSpeed += 1 + levelControl / 4.5;
        if (this.walkAnimationCount > this.walkAnimetionTime) {
            this.scaleX = this.scaleX * -1;
            this.walkAnimationCount = 0;
        }
        this.x =
            this.startVec.x +
            Math.sin(((2 * Math.PI) / 240) * this.walkSpeed) * this.radius;
    },
    //狙い撃ち
    HomingShoot: function () {
        var shoot = new BossHomingShoot(this.x + 32, this.y + 96);
        PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_NORMAL_SHOOT]);
    },
    //破裂する大きい弾
    BigSpreadShoot: function () {
        var shoot = new BossBigSpreadShoot(this.x + 32, this.y + 96);
        PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_DIVISION_SHOOT]);
    },
    //くねくね
    SwingShoot: function () {
        var shoot = new BossSwingShoot(this.x + 32, this.y + 96);
        PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_SWING_SHOOT]);
    },
    //ブーメラン
    CircleShoot: function () {
        var shoot = new BossCircleShoot(this.x, this.y);
    },
    //三発ショット
    ThreeWayShoot: function () {
        var shoot = new BossThreeWayShootCreater(this.x + 32, this.y + 96);
    },
    //リーフシールドクリエイト
    LeafShildCreate: function (_distance, _direction, _num) {
        for (let i = 0; i < _num; i++) {
            var shoot = new BossLeafShild(
                this.x,
                this.y,
                _distance,
                (i * 360) / _num + _direction
            );
        }
        PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_LEAFSHILD]);
    },
    //レベル調整
    LevelControl: function () {
        let levelControlNum = Math.floor(this.maxHp / this.levelMax);
        levelControl = Math.floor((this.maxHp - this.hp) / levelControlNum) + 1;
    },
    //体力が0になったときにゲームクリアクラスを呼び出す処理
    BossDestroy: function () {
        if (this.hp <= 0) {
            this.visible = false;
            var bomb = new EffectFutomomoBomb(
                this.centerVec.x,
                this.centerVec.y
            );
            var gameClear = new BossGameClear();
        }
    },
});
//体力バー
var DrawBossHPBar = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        this.barWidth = HP_BAR_WIDTH;
        enchant.Sprite.call(this, this.barWidth, HP_BAR_HEIGHT);
        this.x = x;
        this.y = y;
        //カラー
        this.r = 252;
        this.g = 0;
        this.b = 0;
        this.a = 1.0;
        //サーフェス
        this.surf = new Surface(this.barWidth, HP_BAR_HEIGHT);
        this.surf.context.beginPath();
        this.surf.context.fillStyle = Color.rgba(
            this.r,
            this.g,
            this.b,
            this.a
        );
        this.surf.context.fillRect(0, 0, this.barWidth, HP_BAR_HEIGHT);
        this.image = this.surf;
        UIs.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            //色更新
            this.surf.context.beginPath();
            this.surf.context.fillStyle = Color.rgba(
                this.r,
                this.g,
                this.b,
                this.a
            );
            //長さ更新
            if (this.barWidth < 0) {
                this.barWidth = 0;
            }

            this.width = this.barWidth;
            this.surf.context.fillRect(0, 0, this.barWidth, HP_BAR_HEIGHT);
        });
    },
});
//#endregion

//#region エネミーショット関係
/**敵のショット親クラス
 * 当たり判定や削除処理を実行している
 */
var EnemyShoot = enchant.Class.create(InstanceObject, {
    initialize: function (width, height) {
        InstanceObject.call(this, width, height);
        this.isScreenDestroy = true;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                //プレイヤーとの当たり判定
                this.CollisionPlayer();
                this.ScreenOutsideRemove();
            }
        });
        enemyShoots.addChild(this);
    },
    //当たり判定
    CollisionPlayer: function () {
        var hitDistance = (this.width + this.height) / 2;
        for (var i = 0; i < 3; i++) {
            if (this.within(player.hitRange[i], hitDistance / 1.8)) {
                //無敵じゃない時
                if (game.isPlayerInvincivle == false) {
                    player.GameOver();
                    //game.GameOverScene = new GameOverScene();
                }
            }
        }
    },
    ScreenOutsideRemove: function () {
        if (!this.IsScreenInside() && this.isScreenDestroy == true) {
            this.Remove();
        }
    },
});
/*PurPleShoot
リーフヴィラン(紫)が使うショット
*/
var PurpleShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y, _direction) {
        //初期設定
        EnemyShoot.call(this, 24, 42);
        this.x = x;
        this.y = y;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PURPLE_SHOOT]];
        //現在の角度代入
        this.rotation = _direction;
        this.frame = 0;

        //Update
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                //画像と角度が合っていないため矯正している
                this.rotation = _direction;
                //レベルに応じて速さがアップ
                this.MoveToForward(
                    5 + Math.floor(levelControl / 10),
                    this.rotation
                );
                this.rotation -= 90;
                //アニメーション速度
                this.frame += 0.3;
            }
        });
    },
});
//リーフヴィラン(青)が使うショット
var BlueShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y, _moveSpeed, _direction) {
        //初期設定;
        EnemyShoot.call(this, 30, 27);
        this.x = x;
        this.y = y;
        this.moveSpeed = _moveSpeed + Math.floor(levelControl / 7);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BLUE_SHOOT]];
        this.rotation = _direction;
        this.frame = 0;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                //下に行くだけ
                this.frame += 0.3;
                this.y += this.moveSpeed;
            }
        });
    },
});
//リーフヴィラン(黄)が使うショット(?)
var YellowShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, 120, 120);
        this.x = x;
        this.y = y;
        this.scale(1.2, 1.2);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.YELLOW_SHOOT]];
        this.frame = 0;
        this.count = 0;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.frame += 0.5;
                this.count++;
                if (this.count > 62) {
                    this.Remove();
                }
            }
        });
    },
});
//#region ここからボスショット
//ホーミング弾
var BossHomingShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, 24, 24);
        this.x = x;
        this.y = y;
        this.scale(1.5, 1.5);
        this.moveSpeed = 12 + levelControl;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BOSS_HORMING]];
        this.frame = 0;
        //目標座標
        this.targetVec = new Vector(player.x, player.y + 48);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        enemyShoots.addChild(this);
    },
    Main: function () {
        this.frame += 0.5;
        //目標座標にすっ飛ばす
        this.MoveTowardsPoint(
            this.targetVec.x,
            this.targetVec.y,
            this.moveSpeed
        );
    },
});
//まっすぐ飛ぶボスの弾
var BossStraightShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y, _direction) {
        EnemyShoot.call(this, 20, 20);
        this.x = x;
        this.y = y;
        this.moveDirection = _direction;
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.BOSS_SPREAD_SHOOT]];
        this.frame = 0;
        this.moveSpeed = new Vector(0, 10 + levelControl / 3);

        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        enemyShoots.addChild(this);
    },
    Main: function () {
        //指定された方向へ飛ばす
        this.MoveToDirection(this.moveSpeed.y, this.moveDirection);
        this.frame += 0.2;
    },
});
//周りに弾を飛ばすための弾
var BossBigSpreadShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BOSS_BIG_SHOOT]];

        this.frame = 0;
        //移動座標
        this.moveCenterPos = Rand.Choose(500, 600, 700, 800);
        this.movePoint = new Vector(this.x, this.moveCenterPos);
        this.moveSpeed = new Vector(0, 15 + levelControl * 2);
        this.attackCount = 0;
        //破裂するまでの時間
        this.attackTime = 30 - levelControl;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        enemyShoots.addChild(this);
    },
    Main: function () {
        this.attackCount++;
        this.frame += 0.5;
        //指定座標に移動
        this.MoveTowardsPointFrame(
            this.movePoint.x,
            this.movePoint.y,
            this.moveSpeed.y
        );
        //爆発すると弾を飛ばす
        if (this.attackCount % this.attackTime == 0) {
            let shootNum = 6 + Math.floor(levelControl / 2);
            let direction = Math.atan2(
                player.y + 48 - this.y,
                player.x + 3 - this.x
            );
            //一発はプレイヤーを狙ってめがける
            direction = direction * (180 / Math.PI);
            for (let i = 0; i < shootNum; i++) {
                var shoot = new BossStraightShoot(
                    this.x,
                    this.y,
                    (i * 360) / shootNum + direction
                );
            }
            PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_DIVISION_BOMB]);
            this.Remove();
        }
    },
});
//揺れる弾
var BossSwingShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, 24, 24);
        this.x = x;
        this.y = y;
        this.startX = x;
        //揺れ幅
        this.radius = 20 + levelControl;
        this.scale(1.5, 1.5);
        //移動速度
        this.moveSpeed = new Vector(
            2.5 + levelControl / 20,
            6 + levelControl / 4
        );
        this.attackCount = 0;
        this.frame = 0;
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.BOSS_SWING_SHOOT]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        enemyShoots.addChild(this);
    },
    Main: function () {
        this.frame += 0.5;
        this.attackCount += this.moveSpeed.x;
        this.RotateSprite(12, 1);
        this.y += this.moveSpeed.y;
        //基準の座標からSinを使って揺らす動き
        this.x =
            this.startX +
            Math.sin(((2 * Math.PI) / 120) * this.attackCount) *
                this.moveSpeed.x *
                this.radius;
    },
});
//ブーメラン
var BossCircleShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y) {
        EnemyShoot.call(this, 48, 48);
        this.moveTo(x, y);
        //中心にするy座標
        // プレイヤーに当たる様に多少ずらしている
        // ブーメランが小さくなりすぎない様に限界値を設定
        this.centerY = player.y - this.y - 100;
        if (this.centerY < 300) {
            this.centerY = 300;
        }

        this.circleCenter = new Vector(this.x, this.centerY);
        this.attackCount = 0;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BOSS_BOOMERANG]];
        //存在する間SEをループする処理のための準備
        game.boomerangSound =
            game.assets[_soundsArray[SOUNDS_NUMBER.BOSS_BOOMERANG]];
        game.boomerangSound.play();
        game.boomerangSound.src.loop = true;
        this.rotateSpeed = 30;
        //半径はプレイヤーと中心の距離で設定
        this.radius =
            PoindDistance(
                this.x,
                this.y,
                this.circleCenter.x,
                this.circleCenter.y
            ) + 65;
        this.maxRadius = 350;
        if (this.radius > this.maxRadius) {
            this.radius = this.maxRadius;
        }
        //円周設定(結局うまく使えていない)
        this.ensyuu = this.radius * 2 * Math.PI;
        this.attackSpeed = this.ensyuu / 360;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            } else {
                //ゲーム終了時にブーメランの音がなっていた場合、消す
                //消した後、ブーメランSE格納変数の中身を-1に
                if (game.boomerangSound != -1) {
                    game.boomerangSound.stop();
                    game.boomerangSound = -1;
                }
            }
        });
        boomerangs.addChild(this);
    },

    Main: function () {
        this.attackCount += 3 + levelControl / 3.5;
        //画像を回転させる
        this.RotateSprite(this.rotateSpeed, 1);
        //葉っぱを一周させる
        var radian = ((this.attackCount + 270) * Math.PI) / 180;
        //楕円型なので横に短く
        var addX = (Math.cos(radian) * this.radius) / 2;
        var addY = Math.sin(radian) * this.radius;
        this.x = boss.x + addX;
        this.y = this.circleCenter.y + addY;
        //一周したら消える設定
        if (this.attackCount > 360) {
            //ブーメランが複数ある場合はSEを消さない
            if (boomerangs.childNodes.length <= 1) {
                game.boomerangSound.stop();
                game.boomerangSound = -1;
            }
            this.Remove();
        }
    },
    //マップ外に行っても消えないように空にする...が
    //後々isScreenDestroyって変数作ったのでこれはいらない
    ScreenOutsideRemove: function () {},
});
//三発ショットを作るクラス
var BossThreeWayShootCreater = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 0, 0);
        this.moveTo(x, y);
        this.threeWayCount = 0;
        this.threeWayTime = 20 - levelControl;
        //飛ばす角度を順番に
        this.threeWayDirection = [90, 110, 70];
        this.threeWayShootCount = 0;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        enemyShoots.addChild(this);
    },
    Main: function () {
        this.x = boss.x + 32;
        //三発飛ばす
        if (this.threeWayCount % this.threeWayTime == 0) {
            var shoot = new BossThreeWayShoot(
                this.x,
                this.y,
                this.threeWayDirection[this.threeWayShootCount],
                this.threeWayShootCount
            );
            this.threeWayShootCount++;
            PlaySE(_soundsArray[SOUNDS_NUMBER.BOSS_THREE_WAY]);
        }

        //3発撃ったら消える
        if (this.threeWayShootCount == 3) {
            this.Remove();
        }
        this.threeWayCount++;
    },
});
//三発ショット
//代入された値の方向に飛ばすだけ
var BossThreeWayShoot = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y, _direction, _frame) {
        EnemyShoot.call(this, 24, 48);
        this.moveTo(x, y);
        this.moveSpeed = 14 + levelControl;
        this.scaleX = 1.2;
        this.scaleY = 1.2;
        this.moveDirection = _direction;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BOSS_LEAF_SHOOT]];
        this.frame = _frame;
        enemyShoots.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
    },
    Main: function () {
        this.MoveToDirection(this.moveSpeed, this.moveDirection);
    },
});
//リーフシールド
//半径と角度を設定できる
var BossLeafShild = enchant.Class.create(EnemyShoot, {
    initialize: function (x, y, _radius, _direction) {
        EnemyShoot.call(this, 32, 32);
        this.centerVec = new Vector(x, y);
        //半径
        this.leafRadius = 0;
        this.maxLeafRadius = _radius;
        //設置位置
        this.leafDirection = _direction;
        this.scaleX = 1.5;
        this.scaleY = 1.5;
        this.rotation = Rand.IntRandomRange(0, 360);
        this.isScreenDestroy = false;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BOSS_LEAF_SHILD]];
        this.attackCount = 0;
        this.rotateSpeed = 10;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Main();
            }
        });
        leafShilds.addChild(this);
    },
    Main: function () {
        //円運動
        this.attackCount += 3;
        this.RotateSprite(this.rotateSpeed, 1);
        var radian = ((this.attackCount + this.leafDirection) * Math.PI) / 180;
        var addX = Math.cos(radian) * this.leafRadius;
        var addY = Math.sin(radian) * this.leafRadius;
        this.x = boss.centerVec.x + addX;
        this.y = boss.centerVec.y + addY;
        //出現時はだんだん半径を大きくしていく
        //規定の値になったら止まる
        this.leafRadius += 3;
        if (this.leafRadius > this.maxLeafRadius) {
            this.leafRadius = this.maxLeafRadius;
        }
    },
});
//#endregion
//#endregion

//#region アイテム関係
//アイテムクラス(継承用)
var Item = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, x, y);
        //当たっているかどうか
        this.isHit = false;
        this.isAttack = false;
        //アイテムカウント
        this.itemCount = 0;
        //アイテム時間(defaultは0)
        this.itemTime = 0;
        //アイテムID(defaultは0)
        this.itemID = -1;
        //アイテムを装備中かどうか
        this.isEquipment = false;
        //アイテムゲット時のスコア
        this.itemScore = 200;
        //名前
        this.name = "アイテム";
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Update();
                //継承先のUpdate用メソッド
                this.ItemUpdate();
            }
        });
        //itemsグループの子にする
        items.addChild(this);
    },
    Update: function () {
        // 下に行ったら消える
        if (
            this.y + this.height > SCREEN_HEIGHT_GAME &&
            this.isAttack == false
        ) {
            this.Remove();
        }

        //ヒット確認
        if (this.ItemHitPlayer() == true) {
            this.isHit = true;
            //プレイヤーが装備していない状態の時に
            if (this.isEquipment == false) {
                //プレイヤーにヒットしたら攻撃状態へ
                this.isAttack = true;
                //SE再生(ショタアイテムの場合とそれ以外とで分けている)
                if (this.itemID != ITEM_ID.SYOTA) {
                    PlaySE(_soundsArray[SOUNDS_NUMBER.ITEM_GET]);
                } else if (this.itemID == ITEM_ID.SYOTA) {
                    if (game.syotaItemArray[this.syotaNumber] == false) {
                        PlaySE(_soundsArray[SOUNDS_NUMBER.SYOTA_GET]);
                    }
                }
                //スコア加算
                score += this.itemScore;
                //装備状態を保存
                game.isItemEquipment = true;
                //装備
                this.isEquipment = true;
            }
        } else {
            //falseを返す
            this.isHit = false;
        }
        //攻撃可能時はカウントが増える
        if (this.isAttack == true) {
            this.itemCount++;
            if (this.itemCount > this.itemTime) {
                game.isItemEquipment = false;
                this.Remove();
            }
        }
    },
    ItemUpdate: function () {
        //継承先で使う
    },
    //ヒット確認メソッド
    ItemHitPlayer: function () {
        var _rt = false;
        if (player.PlayerCollisionObjects(this.width, this)) {
            _rt = true;
        }
        return _rt;
    },
    //プレイヤーの先端にくっつく処理
    //_setXと_setYはずらす値
    MoveToPlayerEdge: function (_setX, _setY) {
        this.x = player.x + player.width / 2 + _setX;
        this.y = player.y + player.height / 10 + _setY;
    },
});
//ゴリラアイテム、アイテムクラスを継承
var GorillaItem = enchant.Class.create(Item, {
    initialize: function (x, y) {
        Item.call(this, 32, 32);
        this.moveTo(x, y);
        this.frame = 0;
        //移動速度
        this.moveSpeedY = 10;
        this.itemID = ITEM_ID.GORILLA;
        //回転速度
        this.rotateSpeed = 5;
        //回転向き
        this.rotateDirection = Rand.Choose(-1, 1);
        //アイテムとして利用できる時間
        this.itemTime = 300;
        //攻撃間隔
        this.attackInterval = 4;
        //攻撃カウント
        this.attackCount = 0;
        this.itemScore = 300;

        this.edgeY = Rand.Choose(0, 32, 64);
        //名前
        this.name = "ゴリラアイテム";
        //画像
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.GOLILLA_ITEM]];
    },
    //メインループ
    ItemUpdate: function () {
        if (this.isAttack == false) {
            //攻撃不可能な状態の時の動き
            this.ItemMode();
        } else {
            //攻撃可能な時の動き
            this.EquipmentMode();
        }
    },
    //攻撃不可能な状態(装備していない状態)
    ItemMode: function () {
        //まっすぐ下に
        this.y += this.moveSpeedY;
        //回転させる
        this.RotateSprite(this.rotateSpeed, this.rotateDirection);
    },
    //攻撃可能な状態(装備状態)
    EquipmentMode: function () {
        //先端の少し横へ
        this.MoveToPlayerEdge(-5, this.edgeY);
        //角度を戻す
        this.rotation = 0;
        //アタックカウントインクリメント
        this.attackCount++;
        //タッチしている間攻撃を行う
        if (game.isTouch == true) {
            if (this.attackCount % this.attackInterval == 0) {
                var shoot = new GorillaShoot(this.x, this.y);
                PlaySE(_soundsArray[SOUNDS_NUMBER.BANANA_SHOOT]);
            }
            this.frame = 2;
        } else {
            this.frame = 0;
        }
    },
});
//太ももアイテム
var FutomomoItem = enchant.Class.create(Item, {
    initialize: function (x, y) {
        Item.call(this, 32, 32);
        this.moveTo(x, y);
        this.frame = 0;
        //横移動速度
        this.moveSpeedX = Rand.RandomRange(-4, 4);
        //拡大値
        this.scale(1.5, 1.5);
        this.itemID = ITEM_ID.FUTOMOMO;
        //跳ねる高さ
        this.jumpSpeed = -10;
        //縦移動速度
        this.moveSpeedY = this.jumpSpeed;
        //重力
        this.gravity = 0;
        //次跳ねる座標
        this.nextJumpY = SCREEN_HEIGHT / 4;
        //アイテム装備時間
        this.itemTime = 300;
        //ショット間隔
        this.attackInterval = 15;
        //アタックカウント
        this.attackCount = 0;
        this.itemScore = 300;
        //捕まるy座標
        this.edgeY = Rand.RandomRange(0, 64);
        //名前
        this.name = "太ももアイテム";
        //画像
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.FUTOMOMO_ITEM]];
    },
    ItemUpdate: function () {
        if (this.isAttack == false) {
            //攻撃不可能な状態の時の動き
            this.ItemMode();
        } else {
            //攻撃可能な時の動き
            this.EquipmentMode();
        }
    },
    //アイテム時の動き
    ItemMode: function () {
        //重力加算
        this.gravity += 0.15;
        //だんだん下へ
        this.moveSpeedY += this.gravity;
        this.y += this.moveSpeedY;
        //横移動
        this.x += this.moveSpeedX;
        //次のジャンプ値に行った時
        if (this.y > this.nextJumpY) {
            //リセット
            this.gravity = 0;
            this.moveSpeedY = this.jumpSpeed;
            this.moveSpeedX = Rand.RandomRange(-4, 4);
            //さらに下にジャンプ値設定
            this.nextJumpY *= 2;
        }
    },
    //装備時の動き
    EquipmentMode: function () {
        //先端の少し横へ
        this.MoveToPlayerEdge(-27, this.edgeY);
        //アタックカウントインクリメント
        this.attackCount++;
        //タッチしている間攻撃を行う
        if (game.isTouch == true) {
            if (this.attackCount % this.attackInterval == 0) {
                var shoot = new FutomomoShoot(this.x, this.y);
                PlaySE(_soundsArray[SOUNDS_NUMBER.FUTOMOMO_SHOOT]);
            }
        }
    },
});
//オレンジアイテム
var OrangeItem = enchant.Class.create(Item, {
    initialize: function (x, y) {
        Item.call(this, 32, 32);
        this.moveTo(x, y);
        this.frame = 0;
        //パターン定数
        this.movePatternName = {
            MOVE_FIRST: 0,
            MOVE_HORIZONTAL: 1,
            MOVE_DOWN: 2,
        };
        this.itemID = ITEM_ID.ORANGE;
        //アイテムモードの初期値設定
        this.ItemModeInit();
        //装備時の座標のズレ
        this.edgeVector = new Vector(0, 0);
        //アイテム時間
        this.itemTime = 300;
        //攻撃間隔
        this.attackInterval = 5;
        //アタック感と変数
        this.attackCount = 0;
        this.itemScore = 300;
        //名前
        this.name = "オレンジアイテム";
        //画像
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.ORANGE_ITEM]];
    },
    ItemModeInit: function () {
        //横移動速度
        this.moveSpeedX = 15;
        //縦移動速度
        this.moveSpeedY = 20;
        //止まるx座標
        this.moveStopX = Rand.IntRandomRange(150, SCREEN_WIDTH - 150);
        //止まるy座標
        this.moveStopY = 250;
        //ベクタークラスに代入
        this.moveSpeed = new Vector(this.moveSpeedX, this.moveSpeedY);
        this.moveStop = new Vector(this.moveStopX, this.moveStopY);
        //カウント変数
        this.moveCount = 0;
        //重力(使ってない気がする)
        this.gravity = 0;
        //回転速度
        this.rotateSpeed = 30;
        //回転向き
        this.rotateDirection = Rand.Choose(-1, 1);
        //止まってからのカウント変数
        this.moveStopCount = 0;
        //止まっているフレーム数
        this.moveStopTime = 45;
        ////移動パターン格納変数
        this.movePattern = 0;
    },
    //アイテム時のUpdate
    ItemUpdate: function () {
        if (this.isAttack == false) {
            this.ItemMode();
        } else {
            this.EquipmentMode();
        }
    },
    //アイテムモード
    ItemMode: function () {
        switch (this.movePattern) {
            //初期移動時
            case this.movePatternName.MOVE_FIRST:
                this.MoveFirst();
                break;
            //横移動時
            case this.movePatternName.MOVE_HORIZONTAL:
                this.MoveHorizontal();
                break;
            //落下時
            case this.movePatternName.MOVE_DOWN:
                this.MoveDown();
                break;
            default:
                break;
        }
    },
    //装備時の座標
    EquipmentMode: function () {
        //速度減少
        this.moveSpeed.y /= 1.2;
        //プレイヤーに追従。ズレの分だけ移動させている
        this.y = player.y + this.edgeVector.y + 5 - this.moveSpeed.y;
        this.x = player.x + this.edgeVector.x;

        //アタックカウントインクリメント
        this.attackCount++;
        //タッチしている間攻撃を行う
        if (game.isTouch == true) {
            if (this.attackCount % this.attackInterval == 0) {
                var shoot = new OrangeShoot(this.x, this.y);
                PlaySE(_soundsArray[SOUNDS_NUMBER.BANANA_SHOOT]);
            }
        }
    },
    //プレイヤーとの当たり判定
    //先端にのみ刺さる設定なので特別に設定
    ItemHitPlayer: function () {
        var _rt = false;
        //プレイヤーの当たり判定の一番上のものとだけチェック
        if (player.hitRange[0].within(this, 16)) {
            if (this.isEquipment == false) {
                //装備時の座標のズレを設定
                this.edgeVector = new Vector(
                    this.x - player.x,
                    this.y - player.y
                );
                //装備した瞬間の速度を設定
                this.moveSpeed.y = 10;
                //効果音を鳴らす
                PlaySE(_soundsArray[SOUNDS_NUMBER.ORANGE_EDGE]);
                this.isEquipment = true;
                this.isAttack = true;
            }

            _rt = true;
        }
        return _rt;
    },
    //画面の左寄りにいるかどうかをチェック
    IsScreenLeft() {
        var _rt = -1;
        if (this.x < SCREEN_WIDTH / 2) {
            _rt = 1;
        }
        return _rt;
    },
    //初期移動
    MoveFirst: function () {
        //moveStopの座標へ移動,近づいたら止まる
        if (
            PoindDistance(this.x, this.y, this.moveStop.x, this.moveStop.y) >
            this.moveSpeed.y * 2
        ) {
            this.MoveTowardsPoint(
                this.moveStop.x,
                this.moveStop.y,
                this.moveSpeed.y
            );
            //回転
            this.rotation += this.rotateSpeed;
        } else {
            //近づいたら止まって次の移動パターンへ
            this.moveStop.x =
                this.x + Rand.RandomRange(80, 200) * this.IsScreenLeft();
            this.movePattern = this.movePatternName.MOVE_HORIZONTAL;
        }
    },
    //横移動時
    MoveHorizontal: function () {
        //移動カウント変数
        this.moveCount++;
        //止まってから15フレーム後に移動開始
        if (this.moveCount > 20) {
            //横に移動
            if (
                PoindDistance(this.x, this.y, this.moveStop.x, this.y) >
                this.moveSpeed.x * 2
            ) {
                this.MoveTowardsPoint(
                    this.moveStop.x,
                    this.y,
                    this.moveSpeed.x
                );
                //回転
                this.rotation += this.rotateSpeed;
            } else {
                //近づいたら次のパターンへ
                this.movePattern = this.movePatternName.MOVE_DOWN;
                //落下速度指定
                this.moveSpeed.y = 13;
            }
        }
    },
    //落下時
    MoveDown: function () {
        //下へ
        this.y += this.moveSpeed.y;
    },
});
//プルアイテム
var PullItem = enchant.Class.create(Item, {
    initialize: function (x, y) {
        Item.call(this, 48, 48);
        this.startVec = new Vector(
            Rand.Choose(-100, SCREEN_WIDTH + 100),
            Rand.Choose(500, 600, 700, 800)
        );
        this.moveDirection = Math.sign(this.startVec.x) * -1;
        this.moveTo(this.startVec.x, this.startVec.y);

        this.moveSpeed = 10 * this.moveDirection;
        this.frame = 0;
        this.itemID = ITEM_ID.PULL;
        //アイテムとして利用できる時間
        this.itemTime = 300;
        //攻撃間隔
        this.attackInterval = 8;
        //攻撃カウント
        this.attackCount = 0;
        this.itemScore = 300;
        //回転速度
        this.rotateSpeed = 7;
        //回転向き
        this.rotateDirection = Rand.Choose(-1, 1);
        this.edgeY = 0;
        this.shootNum = 5;
        //名前
        this.name = "プルアイテム";
        //画像
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PULL_ITEM]];
    },
    //メインループ
    ItemUpdate: function () {
        if (this.isAttack == false) {
            //攻撃不可能な状態の時の動き
            this.ItemMode();
        } else {
            //攻撃可能な時の動き
            this.EquipmentMode();
        }
    },
    //攻撃不可能な状態(装備していない状態)
    ItemMode: function () {
        //まっすぐ横に
        this.x += this.moveSpeed;
        //回転させる
        this.RotateSprite(this.rotateSpeed, this.rotateDirection);

        if (this.x < -200 || this.x > SCREEN_WIDTH + 200) {
            this.Remove();
        }
    },
    //攻撃可能な状態(装備状態)
    EquipmentMode: function () {
        //先端の少し横へ
        this.MoveToPlayerEdge(-16, this.edgeY);
        //角度を戻す
        this.rotation = 90;
        //アタックカウントインクリメント
        this.attackCount++;
        //タッチしている間攻撃を行う
        if (game.isTouch == true) {
            if (this.attackCount % this.attackInterval == 0) {
                for (let i = 0; i < this.shootNum; i++) {
                    var shoot = new PullShoot(
                        this.x,
                        this.y,
                        90 + Math.floor(this.shootNum / 2) * 15 - i * 15
                    );
                    console.log(i);
                }

                PlaySE(_soundsArray[SOUNDS_NUMBER.BANANA_SHOOT]);
            }
        }
    },
});
//ショタアイテム
var SyotaItem = enchant.Class.create(Item, {
    initialize: function (x, y) {
        Item.call(this, 48, 48);
        this.moveTo(x, y);
        this.frame = 0;
        this.itemTime = 100;
        this.itemID = ITEM_ID.SYOTA;
        //移動速度
        this.moveSpeedY = 15;
        this.UISetX = 50;
        this.UISetY = SCREEN_HEIGHT - 50;
        this.name = "ショタ";
        this.itemScore = 100;
        this.UISetVector = new Vector(this.UISetX, this.UISetY);
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SYOTA_ITEM_SHOOT]];
        //this.syotaNumber = game.syotaItemGetCount;

        this.syotaNumber = Rand.Choose(0, 1, 2);
        this.frame = this.syotaNumber;
    },
    ItemUpdate: function () {
        if (this.isAttack == false) {
            //攻撃不可能な状態の時の動き
            this.ItemMode();
        } else {
            //攻撃可能な時の動き
            this.EquipmentMode();
        }
    },
    ItemMode: function () {
        this.y += this.moveSpeedY;
    },
    EquipmentMode: function () {
        //ゲットしたショタ文字をまだ取得していなかった場合
        //さらに無敵状態ではない場合
        if (
            game.syotaItemArray[this.syotaNumber] == false &&
            game.isPlayerInvincivle == false
        ) {
            //ショタ文字格納配列に対応した文字を真に
            game.syotaItemArray[this.syotaNumber] = true;
            //今は使っていない可能性
            var setVector = this.UIVector;
            //対応するUIを見える状態に
            _syotaItemUI[this.syotaNumber].visible = true;
            //アイテムをゲットした時に装備状態をオンにされているのでオフにする
            game.isItemEquipment = false;
            //全てのショタアイテムをゲットしているかチェック
            this.IsGetSyotaItemAll();
            this.Remove();
        }
        this.y += this.moveSpeedY;
    },
    //全てのショタアイテムをゲットしているかチェック
    IsGetSyotaItemAll() {
        for (let i = 0; i < 3; i++) {
            if (game.syotaItemArray[i] == true) {
                if (i == 2) {
                    //ここで無敵モードに入る処理を書いているが、これはメソッドにするべきだと思った
                    game.isPlayerInvincivle = true;
                    this.itemScore = 1500;
                    PlaySE(_soundsArray[SOUNDS_NUMBER.SYOTA_CONMPLEAT]);
                    game.assets[_soundsArray[SOUNDS_NUMBER.NORMAL_BGM]].stop();
                    PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.INVINCIBLE_BGM]);
                    let shoot = new SyotaInvincibleRibbon(
                        player.centerX - 16,
                        player.y + 70
                    );
                }
            } else {
                break;
            }
        }
    },
});
//無敵時に出現するリボン、ショットを撃つ
var SyotaInvincibleRibbon = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 32, 32);
        this.moveTo(x, y);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PLAYER_RIBBON]];
        //20秒間
        this.invincibleTime = 20 * game.fps;
        this.invincibleCount = 0;
        this.shootInterval = 3;
        this.shootFrame = 0;
        this.syotaFrameCount = 0;
        this.ColorSet();
        game.activeScene.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.InvincibleUpdate();
            }
        });
    },
    //無敵中の背景の色を制御するための変数
    ColorSet: function () {
        this.colorR = 242;
        this.colorG = 230;
        this.colorB = 0;
        this.alpha = 0;
        this.isColorShine = true;
        this.isAlphaShine = false;
        var effectShockwave = new EffectSyotaShockwave(this.x, this.y);
    },
    BackgroundColorControl: function () {
        //白くなっていくときの処理
        if (this.isColorShine == true) {
            this.colorB += 10;
            //無敵時間終了間際までの処理
            if (this.invincibleCount < this.invincibleTime - 50) {
                //透明度をプラスしていく
                this.alpha += 0.05;
                if (this.alpha > 1) {
                    this.alpha = 1;
                }
            }
            //青が規定値に行った場合今度は黄色に戻る処理を行う
            if (this.colorB > 218) {
                this.isColorShine = false;
            }
            //黄色になっていく処理
        } else if (this.isColorShine == false) {
            this.colorB -= 10;
            if (this.colorB < 0) {
                this.isColorShine = true;
            }
        }
        //無敵時間終了間際は点滅する処理
        if (this.invincibleCount > this.invincibleTime - 50) {
            if (this.isAlphaShine == true) {
                this.alpha += 0.1;
            } else if (this.isAlphaShine == false) {
                this.alpha -= 0.1;
            }
            if (this.alpha < 0) {
                this.isAlphaShine = true;
            }
            if (this.alpha > 1) {
                this.isAlphaShine = false;
            }
        }
        //色設定
        game.activeScene.backgroundColor = Color.rgba(
            this.colorR,
            this.colorG,
            this.colorB,
            this.alpha
        );
    },
    //無敵時間中の処理
    InvincibleUpdate: function () {
        //プレイヤーの無敵をtrueに
        game.isPlayerInvincivle = true;
        //リボン設置位置
        this.x = player.x + 3 - this.width / 2;
        this.y = player.y + 70;
        this.invincibleCount++;
        //ショタショット
        if (this.invincibleCount % this.shootInterval == 0) {
            if (game.isTouch == true) {
                let shoot = new SyotaShoot(
                    this.x,
                    this.y - 70,
                    this.shootFrame
                );
                this.shootFrame++;
                this.syotaFrameCount++;
                //ショタの文字を順番に出して、アになったらアを出し続ける処理
                if (this.shootFrame > 3) {
                    this.shootFrame = 3;
                }
                //一定時間アを撃ったらまたシから始まる処理
                if (this.syotaFrameCount > 20) {
                    this.shootFrame = 0;
                    this.syotaFrameCount = 0;
                }
                PlaySE(_soundsArray[SOUNDS_NUMBER.BANANA_SHOOT]);
            }
        }
        //背景色を変更する処理
        this.BackgroundColorControl();
        //無敵時間終了時の処理
        if (this.invincibleCount > this.invincibleTime) {
            game.isPlayerInvincivle = false;
            //無敵BGMを止めて通常BGMを再生する
            game.assets[_soundsArray[SOUNDS_NUMBER.INVINCIBLE_BGM]].stop();
            PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.NORMAL_BGM]);
            //背景を透明にし、本来の背景を表示する
            game.activeScene.backgroundColor = Color.rgba(0, 0, 0, 0);
            //ショタアイテムをリセット
            for (let i = 0; i < 3; i++) {
                game.syotaItemArray[i] = false;
                _syotaItemUI[i].visible = false;
            }
            this.Remove();
        }
        if (game.isTouch == false) {
            this.shootFrame = 0;
        }
    },
});
//ボス用のショタアイテム ショタアイテムを継承
var BossSyotaRibbon = enchant.Class.create(SyotaInvincibleRibbon, {
    initialize: function (x, y) {
        SyotaInvincibleRibbon.call(this, x, y);
        this.x = x - this.width / 2;

        this.y = y;
        game.isPlayerInvincivle = false;
        this.shootInterval = 5;
    },
    //背景色を変えないために空にする
    BackgroundColorControl: function () {},
    //使用しないので空にする
    ColorSet: function () {},
    //プレイヤーが無敵にならないことやアイテムが消滅しないこと以外は同じ
    InvincibleUpdate: function () {
        this.x = player.x + 3 - this.width / 2;
        this.y = player.y + 70;
        this.invincibleCount++;

        if (this.invincibleCount % this.shootInterval == 0) {
            if (game.isTouch == true) {
                let shoot = new SyotaShoot(
                    this.x,
                    this.y - 70,
                    this.shootFrame
                );
                shoot.isHitRemove = true;
                shoot.attackDamage = 1;
                this.shootFrame++;
                this.syotaFrameCount++;
                if (this.shootFrame > 3) {
                    this.shootFrame = 3;
                }

                if (this.syotaFrameCount > 20) {
                    this.shootFrame = 0;
                    this.syotaFrameCount = 0;
                }
                PlaySE(_soundsArray[SOUNDS_NUMBER.BANANA_SHOOT]);
            }
        }
        if (game.isTouch == false) {
            this.shootFrame = 0;
        }
    },
});
//#endregion

//#region プレイヤーショット関係
//プレイヤーショットクラス(継承用)
var PlayerShoot = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, x, y);
        this.name = "プレイヤーショット";
        //敵に当たった時に消えるかどうか(defaultはtrue)
        this.isHitRemove = true;
        //敵がダメージを喰らうかどうか(初期値はtrue)
        this.isDamageEnemy = true;
        //敵に1回しかダメージを与えられないかどうか
        //defaultはtrue(当てた時、無敵時間が発生しない)
        //falseにすると無敵になる
        this.isDamageEnemyOnce = true;
        //当たると凍るかどうか、今の所OrangeShoot限定でtrue
        this.isHitIce = false;
        playerShoots.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.Update();
            }
        });
    },

    Update: function () {
        //敵に当たったかどうか
        var _isHitEnemy = false;
        //当たり判定
        for (let i = 0; i < enemys.childNodes.length; i++) {
            if (this.IsEnemyHit(enemys.childNodes[i])) {
                //敵にダメージを与えられる状態か否か
                if (this.isDamageEnemy == true) {
                    console.log(enemys.childNodes.length);
                    console.log(enemys.childNodes[i].name);
                    //敵にダメージを与える
                    enemys.childNodes[i].SendDamage(this.attackDamage);
                    //凍らせるかどうかを判定
                    enemys.childNodes[i].IceDamage(this.isHitIce);
                    //もう一度ダメージを与えるかどうかを設定
                    this.isDamageEnemy = this.isDamageEnemyOnce;
                }
                //当たったのでtrue
                _isHitEnemy = true;
            }
        }
        //敵に当てた場合で尚且つ、当てた時に消える設定ならば消す
        if (_isHitEnemy == true && this.isHitRemove == true) {
            this.Remove();
        }
        //画面外に行ったら削除
        if (this.IsScreenInside() == false) {
            this.Remove();
        }
    },
    //敵との干渉判定
    IsEnemyHit: function (_object) {
        let _rt = false;
        if (this.intersect(_object)) {
            if (_object.IsScreenInside()) {
                _rt = true;
            }
        }
        return _rt;
    },
});
//ゴリラショット
var GorillaShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y) {
        PlayerShoot.call(this, 24, 24);
        this.moveTo(x, y);
        this.moveSpeedY = 15;
        //攻撃力
        this.attackDamage = 3;

        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BANANA]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.GorillaShootUpdate();
            }
        });
    },
    GorillaShootUpdate: function () {
        //まっすぐ進むだけ
        this.y -= this.moveSpeedY;
    },
});
//太ももショット
var FutomomoShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y) {
        PlayerShoot.call(this, 32, 32);
        this.moveTo(x, y);
        this.moveSpeed = 1;
        this.moveSpeedY = 0;
        this.scale(1.5, 1.5);
        //速度最大値
        this.moveSpeedMax = 20;
        //攻撃力
        this.attackDamage = 8;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.FUTOMOMO_SHOOT]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.FutomomoShootUpdate();
            }
        });
    },
    FutomomoShootUpdate: function () {
        //徐々に加速していく設定
        this.moveSpeedY += this.moveSpeed;
        //最大値で上昇は止まる
        if (this.moveSpeedY > this.moveSpeedMax) {
            this.moveSpeedY = this.moveSpeedMax;
        }
        this.y -= this.moveSpeedY;
    },
    Destroy: function () {
        //Removeされる時に呼ばれるメソッド
        //爆発の当たり判定とエフェクトをセット
        if (this.IsScreenInside() == true) {
            let bomb = new FutomomoBomb(this.x - 64, this.y - 64);
            let bombeffect = new EffectCreate(
                this.x,
                this.y,
                EFFECT_KIND.FUTOMOMO
            );
            PlaySE(_soundsArray[SOUNDS_NUMBER.FUTOMOMO_BOMB]);
        }
    },
});
//爆発の当たり判定
var FutomomoBomb = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y) {
        PlayerShoot.call(this, 128, 128);
        this.moveTo(x, y);
        this.attackCount = 0;
        //攻撃力
        this.attackDamage = 8;
        //同じ的には一回しか当たらない
        this.isDamageEnemyOnce = false;
        //敵に当たっても消えない
        this.isHitRemove = false;
        //当たり判定可視化
        this.visible = IS_VISIBLE_HIT_RANGE;
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.FUTOMOMO_BOMB_HIT_RANGE]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                //20フレームで消える
                if (this.attackCount == 20) {
                    this.Remove();
                }
                this.attackCount++;
            }
        });
    },
});
//オレンジショット
var OrangeShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y) {
        PlayerShoot.call(this, 16, 16);
        this.moveTo(x, y);
        this.frame = 0;
        this.moveSpeed = new Vector(0, 25);
        this.attackDamage = 2;
        this.isHitIce = true;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.ORANGE_SHOOT]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.OrangeShootUpdate();
            }
        });
    },
    OrangeShootUpdate: function () {
        this.frame += 1;
        //まっすぐ進むだけ
        this.y -= this.moveSpeed.y;
    },
});
//プルショット
var PullShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y, _direction) {
        PlayerShoot.call(this, 32, 32);
        this.moveTo(x, y);
        this.moveSpeedY = 0;
        this.maxMoveSpeed = 20;
        this.gravity = 0;
        //攻撃力
        this.attackDamage = 1.5;
        this.moveDirection = _direction;
        this.rotateSpeed = 30;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PULL_SHOOT]];
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.PullShootUpdate();
            }
        });
    },
    PullShootUpdate: function () {
        //角度に合わせて進む
        this.gravity += 0.3;
        this.moveSpeedY += this.gravity;
        if (this.moveSpeedY > this.maxMoveSpeed) {
            this.moveSpeedY = this.maxMoveSpeed;
        }
        this.MoveToDirection(this.moveSpeedY, this.moveDirection - 180);
        this.RotateSprite(this.rotateSpeed, 1);
    },
});
//ショタショット
var SyotaShoot = enchant.Class.create(PlayerShoot, {
    initialize: function (x, y, _frame) {
        PlayerShoot.call(this, 48, 48);
        this.moveTo(x, y);
        this.moveSpeedY = 25;
        this.attackDamage = 4;
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SYOTA_ITEM_SHOOT]];
        this.frame = _frame;
        //敵に当たった時に消えるかどうか(defaultはtrue)
        this.isHitRemove = false;
        //敵に1回しかダメージを与えられないかどうか
        //defaultはtrue(当てた時、無敵時間が発生しない)
        //falseにすると無敵になる
        this.isDamageEnemyOnce = false;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.SyotaShootUpdate();
            }
        });
    },
    SyotaShootUpdate: function () {
        this.y -= this.moveSpeedY;
        this.LeafShildUpdate();
    },
    //リーフシールドに当たったときに消える処理
    //今回はショタショットのみだが、本来であれはプレイヤーショットクラスのメンバメソッドにするのが妥当である
    LeafShildUpdate: function () {
        //リーフシールドに当たったかどうか
        var _isLeafShoots = false;
        //当たり判定
        for (let i = 0; i < leafShilds.childNodes.length; i++) {
            if (this.IsEnemyHit(leafShilds.childNodes[i])) {
                //当たったのでtrue
                _isLeafShoots = true;
            }
        }

        //敵に当てた場合で尚且つ、当てた時に消える設定ならば消す
        if (_isLeafShoots == true) {
            this.Remove();
        }
    },
});
//#endregion

//#region エフェクト関係
/**エフェクト作成クラス
 * 今回は結局太ももしか使わなかったが、ヒットエフェクトをそれぞれ出す場合はもっと活用した
 */
var EffectCreate = enchant.Class.create(InstanceObject, {
    initialize: function (x, y, _effectKind) {
        InstanceObject.call(this, 0, 0);
        this.moveTo(x, y);
        //エフェクトカウント
        this.effectCount = 0;
        //エフェクトの種類
        this.effectKind = _effectKind;

        this.parentCreateClass = this;
        //初期設定
        this.EffectInit(this.effectKind);
        effects.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                //Update
                this.EffectUpdate(this.effectKind);
            }
        });
    },
    EffectInit: function (_kind) {},
    EffectUpdate: function (_kind) {
        //太ももエフェクトの場合
        if (_kind == EFFECT_KIND.FUTOMOMO) {
            this.effectCount++;
            //3フレームに一回エフェクトを発生
            if (this.effectCount % 3 == 0) {
                //場所は-64,64の間からランダム
                var _efX = Rand.RandomRange(this.x - 64, this.x + 64);
                var _efY = Rand.RandomRange(this.y - 64, this.y + 64);

                var _ef = new EffectFutomomoBomb(_efX, _efY);
            }
            //20超えたら消える
            if (this.effectCount > 20) {
                //this.parentCreateClass.Remove();
                this.Remove();
            }
        }
    },
});
//ボムの爆発エフェクト
var EffectFutomomoBomb = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 32, 32);
        //大きさを1倍〜4倍でランダムに設定
        this.scaleNum = Rand.Choose(1, 2, 3, 4);
        this.scale(this.scaleNum, this.scaleNum);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.FUTOMOMO_EFFECT]];
        this.frame = 0;
        this.frameCount = 0;
        effects.addChild(this);
        this.moveTo(x, y);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.frame++;
            this.frameCount++;
            //アニメーション終了時に消す
            if (this.frameCount == 6) {
                this.Remove();
            }
        });
    },
});
//蜜柑の氷エフェクト
var EffectOrangeIce = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 47, 46);
        this.scale(1.5, 1.5);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.ORANGE_EFFECT]];
        effects.addChild(this);
        PlaySE(_soundsArray[SOUNDS_NUMBER.ICE_CREATE]);
        this.moveTo(x, y);
    },
});
//無敵状態になったときに発生する衝撃波エフェクト
var EffectSyotaShockwave = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 500, 500);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.SHOCKWAVE]];
        this.moveTo(x - this.width / 2, y - this.height / 2);
        this.scaleX = 0;
        this.scaleY = 0;
        this.scaleNum = 0;
        effects.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.scaleNum += 0.6;
            this.scaleX = this.scaleNum;
            this.scaleY = this.scaleNum;
            if (this.scaleNum > 8) {
                this.Remove();
            }
        });
    },
});
//雲生成クラス
var BackgroundFogCreater = enchant.Class.create(enchant.Sprite, {
    initialize: function () {
        enchant.Sprite.call(this, 0, 0);
        this.fogCount = 0;
        this.fogCreateTime = Rand.IntRandomRange(10, 50);
        this.fogCreateX = Rand.IntRandomRange(0, SCREEN_WIDTH);

        backgroundFogs.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.fogCount++;
            if (this.fogCount == this.fogCreateTime) {
                var fog = new BackgroundFog(this.fogCreateX, -320);
                this.fogCreateTime += Rand.IntRandomRange(10, 50);
                this.fogCreateX = Rand.IntRandomRange(0, SCREEN_WIDTH);
            }
        });
    },
});
//流れる雲
var BackgroundFog = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 180, 320);
        this.name = "雲";
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BACKGROUND_FOG]];
        this.moveTo(x, y);
        var randomScale = Rand.RandomRange(0.3, 0.7);
        this.scale(randomScale, randomScale);
        this.frame = Rand.Choose(0, 1, 2);
        this.moveSpeed = new Vector(0, Rand.RandomRange(2, 5));
        this.opacity = 0.15;
        backgroundFogs.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.y += this.moveSpeed.y;
                if (this.y > SCREEN_HEIGHT) {
                    this.Remove();
                }
            }
        });
    },
});

//星生成クラス
var BackgroundStarCreater = enchant.Class.create(enchant.Sprite, {
    initialize: function () {
        enchant.Sprite.call(this, 0, 0);
        this.starCount = 0;
        this.starCreateTime = Rand.IntRandomRange(10, 50);
        this.starCreateX = Rand.IntRandomRange(0, SCREEN_WIDTH);

        backgroundFogs.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.starCount++;
            if (this.starCount == this.starCreateTime) {
                var fog = new BackgroundStar(this.starCreateX, -320);
                this.starCreateTime += Rand.IntRandomRange(2, 15);
                this.starCreateX = Rand.IntRandomRange(0, SCREEN_WIDTH);
            }
        });
    },
});
//流れる星
var BackgroundStar = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 16, 16);
        this.name = "星";
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.BACKGROUND_STAR]];
        this.moveTo(x, y);
        var randomScale = Rand.RandomRange(1, 2);
        this.scale(randomScale, randomScale);
        this.frame = Rand.Choose(0, 1, 2, 3);
        this.moveSpeed = new Vector(0, Rand.RandomRange(10, 25));
        this.opacity = 0.25;
        this.rotate = Rand.RandomRange(0, 360);
        this.rotateSpeed = Rand.RandomRange(5, 20);
        this.rotateDirection = Rand.Choose(1, -1);
        backgroundFogs.addChild(this);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.isStopGame == false) {
                this.y += this.moveSpeed.y;
                this.RotateSprite(this.rotateSpeed, this.rotateDirection);
                if (this.y > SCREEN_HEIGHT) {
                    this.Remove();
                }
            }
        });
    },
});
//#endregion

//#region UI関係
var ScoreText = enchant.Class.create(enchant.Label, {
    initialize: function () {
        enchant.Label.call(this);
        //this = new Label();
        this.font = "22px Meiryo";
        this.color = Color.rgb(255, 255, 255);
        this.width = 400;
        this.moveTo(300, 20);
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            this.text = "SCORE:" + score;
        });
        game.activeScene.addChild(this);
    },
});
var SyotaUI = enchant.Class.create(InstanceObject, {
    initialize: function (x, y, _syotaNum) {
        InstanceObject.call(this, 32, 32);
        this.moveTo(x, y);
        this.syotaNumber = _syotaNum;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.SYOTA_ITEM_UI]];
        this.frame = _syotaNum;
        this.visible = false;
        game.activeScene.addChild(this);
    },
});
var BackgroundBottom = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 500, 40);
        this.moveTo(x, y);
        this.scale(1, 2);
        this.image =
            game.assets[_spritesArray[SPRITES_NUMBER.BACKGROUND_BOTTOM]];
        UIsBack.addChild(this);
    },
});
var TextClass = enchant.Class.create(enchant.Label, {
    initialize: function (x, y, _text, _font, _color) {
        enchant.Label.call(this);
        this.font = _font;
        this.color = _color;
        this.width = 400;
        this.moveTo(x, y);
        this.text = _text;
        game.activeScene.addChild(this);
    },
});
var CopyRightClass = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 365, 26);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.COPY_RIGHT]];
        this.moveTo(x, y);
        game.rootScene.addChild(this);
    },
});
var TextFrame = enchant.Class.create(TextClass, {
    initialize: function (x, y, _text, _font, _color) {
        TextClass.call(this, x, y, _text, _font, _color);
        this.color = _color;
        this._sprite = new Sprite(160, 79);
        this._sprite.moveTo(x - 10, y - 30);
        this._sprite.image =
            game.assets[_spritesArray[SPRITES_NUMBER.TEXT_FRAME]];
        this._replaceScene = null;
        // タッチイベントを登録
        this._sprite.addEventListener(Event.TOUCH_END, this.onTouchEnd);

        game.activeScene.addChild(this._sprite);
    },
    onTouchEnd: function () {},
});
//Ready Startの文字
var ReadyStartUI = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 100, 40);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.READY_START]];
        this.moveTo(x, y);
        this.scale(1.5, 1.5);
        this.frame = 0;
        this.addEventListener(EVENT.ENTER_FRAME, function () {
            if (game.startCount > game.startTime) {
                this.frame = 1;
            }
            if (game.startCount > game.startTime * 2) {
                this.Remove();
            }
        });
        game.activeScene.addChild(this);
    },
});
//プレイヤーのHPゲージ
var PlayerHeartUI = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 32, 32);
        this.frame = 0;
        this.scaleX = 2;
        this.scaleY = 2;
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.PLAYER_HEART]];
        this.moveTo(x, y);
        UIs.addChild(this);
    },
});

var TutorialSprite = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 500, 850);
        this.moveTo(x, y);
        this.image = game.assets[_spritesArray[SPRITES_NUMBER.TUTORIAL]];
        this.frame = 0;
        game.activeScene.addChild(this);
        this.addEventListener(EVENT.TOUCH_END, function () {
            if (this.frame == 1) {
                game.tutorialScene.Pop();
            } else {
                this.frame = 1;
            }
        });
    },
});
//#endregion

SoundRoomClass = enchant.Class.create(InstanceObject, {
    initialize: function (x, y) {
        InstanceObject.call(this, 0, 0);
        game.assets[game.nowBGM].stop();
        game.nowBGM = -1;
        game.soundNum = 5;
        game.chooseNum = 0;
        game.activeScene.addChild(this);
        this.SoundInit();
        this.LabelInit();
        this.PlayButtonInit();
        this.StopButtonInit();
        this.ScrollButtonInit();
        this.BackButtonInit();
    },
    SoundInit: function () {
        this.soundList = new Array(game.soundNum);
        for (let i = 0; i < this.soundList.length; i++) {
            this.soundList[i] = _soundsArray[i];
        }
        this.soundName = new Array(game.soundNum);
        this.soundName[SOUNDS_NUMBER.NORMAL_BGM] = "ノーマルモード";
        this.soundName[SOUNDS_NUMBER.MIDDLE_BOSS_BGM] = "ボスモード";
        this.soundName[SOUNDS_NUMBER.TITLE_BGM] = "タイトル";
        this.soundName[SOUNDS_NUMBER.GAMEOVER_BGM] = "ゲームオーバー";
        this.soundName[SOUNDS_NUMBER.BOSS_FANFARE] = "ゲームクリア";
    },
    LabelInit: function () {
        game.soundNameText = new Label();
        game.soundNameText.font = Font.SetMeiryo(22);
        game.soundNameText.color = Color.rgb(0, 0, 0);
        game.soundNameText.width = 500;
        game.soundNameText.moveTo(36, 360);
        game.soundNameText.text = this.soundName[game.chooseNum];
        game.activeScene.addChild(game.soundNameText);
    },
    PlayButtonInit: function () {
        this.PlayButton = new Sprite(64, 64);
        this.PlayButton.frame = 0;
        this.PlayButton.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SOUND_PLAY_BUTTON]];
        this.PlayButton.moveTo(136, 500);
        game.activeScene.addChild(this.PlayButton);
        this.PlayButton.soundList = this.soundList;

        this.PlayButton.addEventListener(EVENT.TOUCH_START, function () {
            this.frame = 1;
        });

        this.PlayButton.addEventListener(EVENT.TOUCH_END, function () {
            this.frame = 0;
            if (game.nowBGM != -1) {
                game.assets[game.nowBGM].stop();
            }

            PlaySoundLoop(this.soundList[game.chooseNum]);
        });
    },
    StopButtonInit: function () {
        this.StopButton = new Sprite(64, 64);
        this.StopButton.frame = 0;
        this.StopButton.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SOUND_STOP_BUTTON]];
        this.StopButton.moveTo(236, 500);
        game.activeScene.addChild(this.StopButton);
        this.StopButton.addEventListener(EVENT.TOUCH_START, function () {
            this.frame = 1;
        });
        this.StopButton.addEventListener(EVENT.TOUCH_END, function () {
            this.frame = 0;
            if (game.nowBGM != -1) {
                game.assets[game.nowBGM].stop();
                game.nowBGM = -1;
            }
        });
    },
    ScrollButtonInit: function () {
        this.ScrollButtonLeft = new Sprite(64, 64);
        this.ScrollButtonLeft.frame = 0;
        this.ScrollButtonLeft.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SOUND_SCROLL_BUTTON]];
        this.ScrollButtonLeft.moveTo(36, 500);
        this.ScrollButtonLeft.soundName = this.soundName;
        game.activeScene.addChild(this.ScrollButtonLeft);

        this.ScrollButtonLeft.addEventListener(EVENT.TOUCH_START, function () {
            this.frame = 1;
        });
        this.ScrollButtonLeft.addEventListener(EVENT.TOUCH_END, function () {
            this.frame = 0;
            game.chooseNum -= 1;
            if (game.chooseNum < 0) {
                game.chooseNum = game.soundNum - 1;
            }
            game.soundNameText.text = this.soundName[game.chooseNum];
        });

        this.ScrollButtonRight = new Sprite(64, 64);
        this.ScrollButtonRight.frame = 2;
        this.ScrollButtonRight.image =
            game.assets[_spritesArray[SPRITES_NUMBER.SOUND_SCROLL_BUTTON]];
        this.ScrollButtonRight.moveTo(336, 500);
        this.ScrollButtonRight.soundName = this.soundName;
        game.activeScene.addChild(this.ScrollButtonRight);

        this.ScrollButtonRight.addEventListener(EVENT.TOUCH_START, function () {
            this.frame = 3;
        });
        this.ScrollButtonRight.addEventListener(EVENT.TOUCH_END, function () {
            this.frame = 2;
            game.chooseNum += 1;
            if (game.chooseNum > game.soundNum - 1) {
                game.chooseNum = 0;
            }
            console.log(game.chooseNum);
            game.soundNameText.text = this.soundName[game.chooseNum];
        });
    },
    BackButtonInit: function () {
        this.backButton = new Sprite(128, 128);
        this.backButton.frame = 0;
        this.backButton.image =
            game.assets[_spritesArray[SPRITES_NUMBER.UI_BACK_BUTTON]];
        this.backButton.moveTo(-20, -20);
        this.backButton.scale(0.5, 0.5);
        game.activeScene.addChild(this.backButton);

        this.backButton.addEventListener(EVENT.TOUCH_END, function () {
            if (game.nowBGM != -1) {
                game.assets[game.nowBGM].stop();
            }

            PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.TITLE_BGM]);
            game.ModeSelectScene = new ModeSelectScene();
        });
    },
});
//Managerクラス生成
var GameManager = new GameManagerClass();
//#endregion クラス宣言------------------------------------

class BackGroundClass {
    constructor(_startRGB, _endRGB) {
        //Sprite作成
        this.sprite = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
        //Surface作成
        this.surface = new Surface(SCREEN_WIDTH, SCREEN_HEIGHT);

        //Surfaceを代入
        this.sprite.image = this.surface;

        //コンテキストを取得
        this.context = this.surface.context;

        //以下、HTML5のcanvasと同じように使用可能
        //パスを開始
        this.context.beginPath();

        //上から下までにグラデーションを設定
        this.grad = this.context.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);

        //グラデーション開始
        this.grad.addColorStop(0, _startRGB);

        //グラデーション終了
        this.grad.addColorStop(1, _endRGB);

        this.context.fillStyle = this.grad;

        //長方形を描く
        this.context.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT + 200);
        this.context.fill();
        //パスを終了
        this.context.closePath();
        this.context.stroke();
        //シーンにサーフェスを追加
        game.rootScene.addChild(this.sprite);
    }
    ChangeColor(_startRGB, _endRGB) {
        //パスを開始
        this.context.beginPath();

        //上から下までにグラデーションを設定
        this.grad = this.context.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);

        //グラデーション開始
        this.grad.addColorStop(0, _startRGB);

        //グラデーション終了
        this.grad.addColorStop(1, _endRGB);

        this.context.fillStyle = this.grad;

        //長方形を描く
        this.context.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT + 200);
        this.context.fill();
        //パスを終了
        this.context.closePath();
        this.context.stroke();
    }
}
//背景をグラデーションさせて生成
function BackgroundCreate(_startRGB, _endRGB) {
    //Sprite作成
    sprite = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
    //Surface作成
    surface = new Surface(SCREEN_WIDTH, SCREEN_HEIGHT);

    //Surfaceを代入
    sprite.image = surface;

    //コンテキストを取得
    context = surface.context;

    //以下、HTML5のcanvasと同じように使用可能
    //パスを開始
    context.beginPath();

    //上から下までにグラデーションを設定
    var grad = context.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);

    //グラデーション開始
    grad.addColorStop(0, _startRGB);

    //グラデーション終了
    grad.addColorStop(1, _endRGB);

    context.fillStyle = grad;

    //長方形を描く
    context.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT + 200);
    context.fill();
    //パスを終了
    context.closePath();
    context.stroke();
    //シーンにサーフェスを追加
    game.rootScene.addChild(sprite);
}
//#region シーン関連

//シーン管理クラス(継承用)
class SceneClass {
    constructor() {
        //シーン生成
        this.scene = new Scene();
    }
    //シーンを新たに乗せる
    Push() {
        game.previousScene = game.activeScene;
        game.pushScene(this.scene);
        game.activeScene = this.scene;
        console.log("push");
    }
    //シーンを外す
    Pop() {
        game.previousScene = game.activeScene;
        game.popScene(this.scene);
        game.activeScene = game.previousScene;
        console.log("Pop");
    }
    //シーンを切り替える
    Replace() {
        game.previousScene = game.activeScene;
        game.replaceScene(this.scene);
        game.activeScene = this.scene;
        console.log("Replace");
        console.log(
            `previousScene : ${game.previousScene.name} activeScene : ${game.activeScene.name}`
        );
    }
    //シーンを消す時にオブジェクトを全て消す処理
    static RemoveScene(scene) {
        if (scene.childNodes.length != 0) {
            while (scene.firstChild) {
                scene.removeChild(scene.firstChild);
                console.log("削除なう");
                delete scene.firstChild;
            }
        }
    }
}
//タイトルシーンクラス
class TitleScene extends SceneClass {
    constructor() {
        //親コンストラクタ呼び出し
        super();
        this.scene.name = "タイトルシーン";
        this.Main();
        //タッチを離した時
        this.scene.addEventListener(EVENT.TOUCH_END, function (touch) {
            game.NormalModeScene = new ModeSelectScene();
        });
    }
    //メイン
    Main() {
        //タイトル画像生成
        var TitleImage = new Sprite(803, 200);
        TitleImage.scale(0.6, 0.6);
        TitleImage.moveTo(-150, 100);
        TitleImage.image =
            game.assets[_spritesArray[SPRITES_NUMBER.TITLE_SPRITE]];
        this.scene.addChild(TitleImage);
        //タイトル文字生成
        var touchStartText = new Label();
        touchStartText.font = "36px Meirio";
        touchStartText.color = Color.rgb(0, 0, 0);
        touchStartText.moveTo(150, 400);
        touchStartText.text = "Touch Start!!";
        this.scene.addChild(touchStartText);
        PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.TITLE_BGM]);
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_NORMAL.START,
            BACKGROUND_COLOR_NORMAL.END
        );
        var copyRight = new CopyRightClass(65, 700);
    }
}
class ModeSelectScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "モード選択シーン";
        this.Replace();
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_NORMAL.START,
            BACKGROUND_COLOR_NORMAL.END
        );
        this.Main();
    }
    Main() {
        var _normalModeText = "ノーマルモード";
        var _bossBattleModeText = "ボスモード";
        var _tutorialText = "ゲーム説明";
        var _soundText = "     ♪";
        var normalModeButton = new TextFrame(
            200,
            200,
            _normalModeText,
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );

        normalModeButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            game.NormalModeScene = new NormalModeScene();
        });

        var BossBattleModeButton = new TextFrame(
            200,
            350,
            _bossBattleModeText,
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );

        BossBattleModeButton._sprite.addEventListener(
            EVENT.TOUCH_END,
            function () {
                game.levelChooseModeScene = new LevelChooseScene();
            }
        );
        var tutorialButton = new TextFrame(
            200,
            500,
            _tutorialText,
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );
        tutorialButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            game.tutorialScene = new tutorialScene();
        });

        var soundButton = new TextFrame(
            200,
            650,
            _soundText,
            Font.SetMeiryo(32),
            Color.rgb(0, 0, 0)
        );
        soundButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            game.tutorialScene = new soundScene();
        });
        game.activeScene.addEventListener(EVENT.TOUCH_END, function (touch) {
            //var ssss = new EffectSyotaShockwave(touch.x, touch.y);
        });
    }
}
class LevelChooseScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "モード選択シーン";
        this.Replace();
        this.Main();
    }
    Main() {
        var _easyModeText = "Easy";
        var _normalModeText = "Normal";
        var _hardModeText = "Hard";
        var _extremeModeText = "Extreme";
        var _hagekasuModeText = "Hagekasu";

        var _levelModeText = [
            _easyModeText,
            _normalModeText,
            _hardModeText,
            _extremeModeText,
            _hagekasuModeText,
        ];
        var buttonSpace = 200;
        var _levelModeButton = new Array(4);
        if (s_isExtremeClear == 1) {
            _levelModeButton = new Array(5);
            var buttonSpace = 150;
        }
        for (let i = 0; i < _levelModeButton.length; i++) {
            _levelModeButton[i] = new TextFrame(
                200,
                100 + buttonSpace * i,
                _levelModeText[i],
                Font.SetMeiryo(20),
                Color.rgb(0, 0, 0)
            );
            _levelModeButton[i]._sprite.addEventListener(
                EVENT.TOUCH_END,
                function () {
                    bossLevel = i;
                    game.bossLevelNum = i;
                    game.bossLevelText = _levelModeText[i];
                    game.NormalModeScene = new BossBattleModeScene();
                }
            );
        }
    }
}
class NormalModeScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "ノーマルモードシーン";
        game.modeText = "ノーマルモード";
        game.chooseMode = GAME_MODE.NORMAL;
        this.Replace();
        GroupSet();
        this.Main();
        game.isStopGame = true;
        game.startCount = 0;
        game.startTime = 40;
        this.ReadyStartUpdate();
    }
    Main() {
        player = new Player(247, 500);
        GameManager.GameManagerUpdate();

        // var leafVillans = new LeafVillain(200, 50, LEAF_VILLAN_COLOR.GREEN);
        game.assets[_soundsArray[SOUNDS_NUMBER.TITLE_BGM]].stop();
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_NORMAL.START,
            BACKGROUND_COLOR_NORMAL.END
        );
        PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.NORMAL_BGM]);
        game.backgroundBottom = new BackgroundBottom(0, 0);
        for (let i = 0; i < 3; i++) {
            _syotaItemUI[i] = new SyotaUI(50 + i * 50, 20, i);
            _syotaItemUI.visible = false;
        }
        var scoreText = new ScoreText();

        this.Update();

        var backgroundFog = new BackgroundFogCreater();
    }
    ReadyStartUpdate() {
        this.readyStartUI = new ReadyStartUI(200, 400);
        this.scene.addEventListener(EVENT.ENTER_FRAME, function () {
            game.startCount++;
            if (game.startCount == game.startTime) {
                game.isStopGame = false;
            }
        });
    }
    Update() {
        EnemyCreate();
        ItemCreate();
        SyotaItemCreate();
        LevelControl();
    }
}
//ボスバトルモード
class BossBattleModeScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "ボスバトルシーン";
        game.modeText = "ボスモード";
        game.chooseMode = GAME_MODE.BOSS_BATTLE;
        this.Replace();
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_BOSS.START,
            BACKGROUND_COLOR_BOSS.END
        );
        GroupSet();
        this.Main();
        game.isStopGame = true;
        game.startCount = 0;
        game.startTime = 40;
        this.ReadyStartUpdate();
    }
    Main() {
        player = new BossPlayer(247, 500);
        GameManager.GameManagerUpdate();
        boss = new LeafVillainBoss(64, 64);
        game.backgroundBottom = new BackgroundBottom(0, 0);
        game.assets[_soundsArray[SOUNDS_NUMBER.TITLE_BGM]].stop();
        PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.MIDDLE_BOSS_BGM]);
        var backgroundStar = new BackgroundStarCreater();
    }
    ReadyStartUpdate() {
        this.readyStartUI = new ReadyStartUI(200, 400);
        this.scene.addEventListener(EVENT.ENTER_FRAME, function () {
            game.startCount++;
            if (game.startCount == game.startTime) {
                game.isStopGame = false;
            }
        });
    }
}
//説明書シーン
class tutorialScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "チュートリアルシーン";
        this.Push();
        this.Main();
    }
    Main() {
        this.tutorialSprite = new TutorialSprite(0, 0);
    }
}
//サウンド
class soundScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "サウンドシーン";
        this.Replace();
        this.Main();
    }
    Main() {
        this.soundClass = new SoundRoomClass(0, 0);
    }
}
//ゲームオーバーシーン
class GameOverScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "ゲームオーバーシーン";
        this.Replace();
        game.score = score;
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_RESULT.START,
            BACKGROUND_COLOR_RESULT.END
        );
        if (game.chooseMode == GAME_MODE.NORMAL) {
            this.NormalTextCreate();
            this.NormalButtonCreate();
        } else if (game.chooseMode == GAME_MODE.BOSS_BATTLE) {
            this.BossTextCreate();
            this.BossButtonCreate();
        }
        PlaySound(_soundsArray[SOUNDS_NUMBER.GAMEOVER_BGM]);
        this.scene.addEventListener(EVENT.TOUCH_END, function () {});
    }
    //テキスト生成
    NormalTextCreate() {
        var _gameoverText = new TextClass(
            50,
            100,
            "GAME OVER",
            Font.SetMeiryo(48),
            Color.rgb(255, 255, 50)
        );
        var _scoreText = new TextClass(
            100,
            250,
            `Score : ${score}`,
            Font.SetMeiryo(32),
            Color.rgb(255, 255, 50)
        );
    }
    BossTextCreate() {
        var _gameoverText = new TextClass(
            50,
            100,
            "GAME OVER",
            Font.SetMeiryo(48),
            Color.rgb(255, 255, 50)
        );
        var _scoreText = new TextClass(
            100,
            250,
            `難易度 : ${game.bossLevelText}`,
            Font.SetMeiryo(32),
            Color.rgb(255, 255, 50)
        );
    }
    //ボタン作るよ
    NormalButtonCreate() {
        var RetryButton = new TextFrame(
            100,
            500,
            "もう1度ショタる",
            Font.SetMeiryo(18),
            Color.rgb(0, 0, 0)
        );
        //リトライボタンタッチイベント
        RetryButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            Retry();
            game.NormalModeScene = new ModeSelectScene();
            game.popScene(this.scene);
            game.NormalModeScene.Push();
        });
        //ツイートボタン
        var TweetButton = new TextFrame(
            300,
            500,
            "結果をツイート",
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );
        //ツイートボタンタッチイベント
        TweetButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            window.open(
                "http://twitter.com/intent/tweet?text=TSUMAYOUJIゲーム%0d【" +
                    game.modeText +
                    "】%0dスコア : " +
                    game.score +
                    "%0dみんなもプレイ!!%0dゲームURL" +
                    GAME_URL +
                    "%0d&hashtags=TSUMAYOUJIゲーム %0d ver." +
                    GAME_VER
            ); //ハッシュタグ
        });
    }
    BossButtonCreate() {
        var RetryButton = new TextFrame(
            100,
            500,
            "もう1度ショタる",
            Font.SetMeiryo(18),
            Color.rgb(0, 0, 0)
        );
        //リトライボタンタッチイベント
        RetryButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            Retry();
            game.NormalModeScene = new ModeSelectScene();
            game.popScene(this.scene);
            game.NormalModeScene.Push();
        });
        //ツイートボタン
        var TweetButton = new TextFrame(
            300,
            500,
            "結果をツイート",
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );

        //ツイートボタンタッチイベント
        TweetButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            window.open(
                "http://twitter.com/intent/tweet?text=TSUMAYOUJIゲーム%0d【" +
                    game.modeText +
                    "】%0d難易度: " +
                    game.bossLevelText +
                    "%0d結果 : 敗北 %0dみんなも挑戦しよう!!%0dゲームURL" +
                    GAME_URL +
                    "%0d&hashtags=TSUMAYOUJIゲーム %0d ver." +
                    GAME_VER
            ); //ハッシュタグ
        });
    }
}

class GameClearScene extends SceneClass {
    constructor() {
        super();
        this.scene.name = "ゲームクリアシーン";
        this.Replace();
        game.score = score;
        if (game.bossLevelNum == BOSS_LEVEL.EXTREME) {
            if (window.localStorage) {
                s_isExtremeClear = 1;
                window.localStorage.setItem("isExtremeClear", s_isExtremeClear);
            }
        }
        game.background = new BackGroundClass(
            BACKGROUND_COLOR_RESULT.BOSS_START,
            BACKGROUND_COLOR_RESULT.BOSS_END
        );
        this.TextCreate();
        this.ButtonCreate();
        PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.BOSS_FANFARE]);
        this.scene.addEventListener(EVENT.TOUCH_END, function () {});
    }
    //テキスト生成
    TextCreate() {
        var _gameoverText = new TextClass(
            50,
            100,
            "GAME CLEAR!!",
            Font.SetMeiryo(48),
            Color.rgb(255, 128, 50)
        );
        var _scoreText = new TextClass(
            100,
            250,
            `難易度 : ${game.bossLevelText}`,
            Font.SetMeiryo(32),
            Color.rgb(255, 128, 50)
        );
    }
    //ボタン作るよ
    ButtonCreate() {
        var RetryButton = new TextFrame(
            100,
            500,
            "もう1度ショタる",
            Font.SetMeiryo(18),
            Color.rgb(0, 0, 0)
        );
        //リトライボタンタッチイベント
        RetryButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            Retry();
            game.NormalModeScene = new ModeSelectScene();
            game.popScene(this.scene);
            game.NormalModeScene.Push();
        });
        //ツイートボタン
        var TweetButton = new TextFrame(
            300,
            500,
            "結果をツイート",
            Font.SetMeiryo(20),
            Color.rgb(0, 0, 0)
        );
        //ツイートボタンタッチイベント
        TweetButton._sprite.addEventListener(EVENT.TOUCH_END, function () {
            window.open(
                "http://twitter.com/intent/tweet?text=TSUMAYOUJIゲーム%0d【" +
                    game.modeText +
                    "】%0d難易度: " +
                    game.bossLevelText +
                    "%0d結果 : 勝利!! %0dみんなも挑戦しよう!!%0dゲームURL" +
                    GAME_URL +
                    "%0d&hashtags=TSUMAYOUJIゲーム %0d ver." +
                    GAME_VER
            ); //ハッシュタグ
        });
    }
}
//#endregion

//--------------------------------------------
//メイン
function Main() {
    //シーン生成
    //タイトルシーンからスタート
    game.TitleScene = new TitleScene();

    game.TitleScene.Push();
}
//グループ子ノードに
//レイヤー順になっている
function GroupSet() {
    game.activeScene.addChild(backgroundFogs);
    game.activeScene.addChild(playerGroup);
    game.activeScene.addChild(playerShoots);
    game.activeScene.addChild(enemys);
    game.activeScene.addChild(effects);
    game.activeScene.addChild(enemyShoots);
    game.activeScene.addChild(boomerangs);
    game.activeScene.addChild(leafShilds);
    game.activeScene.addChild(UIsBack);
    game.activeScene.addChild(UIs);
    game.activeScene.addChild(items);
}
//---------------------------------------------

//初期設定
function GameInit() {
    //ゲーム生成
    game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);

    GameVariableInit();

    //ゲーム開始前に必要な画像・音を読み込む部分
    // 必要な音読み込み
    SoundsLoad();
    //必要な画像読み込み
    SpritesLoad();
    //読み込み終わり
}
//難易度調整
function LevelControl() {
    game.activeScene.addEventListener(EVENT.ENTER_FRAME, function () {
        if (game.isStopGame == false) {
            levelControl = Math.floor(score / LEVEL_DESIGN) + 1;
            if (levelControl > 60) {
                levelControl = 60;
            }
            score++;
        }
        game.fps = 30;
    });
}
function GameVariableInit() {
    //fps
    game.fps = GAME_FPS;
    //タッチしているか判断する変数
    game.isTouch = false;
    //タッチした時のタッチx座標
    game.touchStartX = 0;

    game.isStopGame = false;
    game.activeScene;
    game.previousScene;
    //手にしているショタアイテムの個数
    game.syotaItemGetCount = 0;

    game.isPlayerInvincivle = false;
    //ショタ格納定数
    game.syotaNumber = {
        ITEM_SHI: false,
        ITEM_YO: false,
        ITEM_TA: false,
    };
    //ショタ配列、なんでこんな書き方したんやろ
    game.syotaItemArray = [
        game.syotaNumber.ITEM_SHI,
        game.syotaNumber.ITEM_YO,
        game.syotaNumber.ITEM_TA,
    ];

    //ツイート用変数設定
    game.modeText = "";
    game.score = score;

    game.isItemEquipment = false;
}
//BGM再生
function PlaySoundLoop(_sound) {
    //if (Sound.src) {
    game.assets[_sound].play();
    game.assets[_sound].src.loop = true;
    game.nowBGM = _sound;
    // }
}
function PlaySound(_sound) {
    //if (Sound.src) {
    game.assets[_sound].play();
    game.nowBGM = _sound;
    // }
}
//SE再生
function PlaySE(_sound) {
    game.assets[_sound].clone().play();
}
//座標の距離を測る
function PoindDistance(x1, y1, x2, y2) {
    var _x = x2 - x1;
    var _y = y2 - y1;
    var _rt = Math.sqrt(_x * _x + _y * _y);
    return _rt;
}
//敵生成
function EnemyCreate() {
    //Create間隔の最小値最大値
    var minInterval = 30;
    var MaxInterval = 80;
    //間隔セット
    var nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);

    var count = 0;
    //毎フレーム実行
    game.activeScene.addEventListener(EVENT.ENTER_FRAME, function () {
        if (game.isStopGame == false) {
            count++;

            //nextFrameになった時
            if (count % nextFrame == 0) {
                //enemy生成
                var maxEnemyLength = 2 + Math.floor(levelControl / 4);
                if (maxEnemyLength > 20) {
                    maxEnemyLength = 20;
                }
                if (enemys.childNodes.length < maxEnemyLength) {
                    var _leafVillanColor = Rand.Choose(
                        LEAF_VILLAN_COLOR.GREEN,
                        LEAF_VILLAN_COLOR.YELLOW,
                        LEAF_VILLAN_COLOR.BLUE,
                        LEAF_VILLAN_COLOR.PURPLE
                    );
                    var enemy = new LeafVillain(
                        Rand.IntRandomRange(70, 430),
                        -100,
                        _leafVillanColor
                    );
                }

                //次の生成フレームを決定
                minInterval = 30 - Math.floor(levelControl * 1.5);
                MaxInterval = 80 - Math.floor(levelControl * 1.5);
                if (minInterval < 3) {
                    minInterval = 3;
                }
                if (MaxInterval < 20) {
                    MaxInterval = 20;
                }
                nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);
                count = 0;
            }
        }
    });
}
//アイテムを作る
function ItemCreate() {
    //Create間隔の最小値最大値
    var minInterval = 120;
    var MaxInterval = 250;
    //間隔セット
    var nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);
    var ITEM_NUM = {
        GORILLA: 0,
        FUTOMOMO: 1,
        ORANGE: 2,
        PULL: 3,
    };
    var count = 0;
    //毎フレーム実行
    game.activeScene.addEventListener(EVENT.ENTER_FRAME, function () {
        count++;
        //nextFrameになった時
        if (count % nextFrame == 0) {
            //item生成
            _createItemNum = Rand.Choose(0, 1, 2, 3);

            switch (_createItemNum) {
                case ITEM_NUM.GORILLA:
                    var Item = new GorillaItem(
                        Rand.RandomRange(100, SCREEN_WIDTH - 100),
                        -100
                    );
                    break;
                case ITEM_NUM.FUTOMOMO:
                    var Item = new FutomomoItem(
                        Rand.RandomRange(200, SCREEN_WIDTH - 200),
                        -100
                    );
                    break;
                case ITEM_NUM.ORANGE:
                    var Item = new OrangeItem(
                        Rand.RandomRange(100, SCREEN_WIDTH - 100),
                        -100
                    );
                    break;
                case ITEM_NUM.PULL:
                    var Item = new PullItem(
                        Rand.RandomRange(100, SCREEN_WIDTH - 100),
                        -100
                    );
                    break;
                default:
                    break;
            }

            if (score > 40000) {
                minInterval = 100;
                MaxInterval = 230;
            }
            if (score > 100000) {
                minInterval = 80;
                MaxInterval = 200;
            }
            //次の生成フレームを決定
            nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);
            count = 0;
        }
    });
}
//ショタアイテムを作る
function SyotaItemCreate() {
    var minInterval = 250;
    var MaxInterval = 450;
    var nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);

    var count = 0;
    //毎フレーム実行
    game.activeScene.addEventListener(EVENT.ENTER_FRAME, function () {
        if (score > 5000) {
            count++;
            //nextFrameになった時
            if (count % nextFrame == 0) {
                var Syota = new SyotaItem(
                    Rand.RandomRange(100, SCREEN_WIDTH - 100),
                    -100
                );
                if (score > 40000) {
                    minInterval = 300;
                    MaxInterval = 420;
                }
                if (score > 120000) {
                    minInterval = 250;
                    MaxInterval = 380;
                }
                nextFrame = Rand.IntRandomRange(minInterval, MaxInterval);
                count = 0;
            }
        }
    });
}
//リトライ
function Retry() {
    game.assets[game.nowBGM].stop();
    SceneClass.RemoveScene(game.NormalModeScene.scene);
    delete enemys;
    enemys = new Group();
    items = new Group();
    enemyShoots = new Group();
    boomerangs = new Group();
    playerShoots = new Group();
    effects = new Group();
    backgroundFogs = new Group();
    playerGroup = new Group();
    UIsBack = new Group();
    UIs = new Group();
    leafShilds = new Group();
    GameVariableInit();
    score = 0;
    PlaySoundLoop(_soundsArray[SOUNDS_NUMBER.TITLE_BGM]);
    for (let i = 0; i < _syotaItemUI.length; i++) {
        _syotaItemUI[i].visible = false;
    }
    game.frame = 0;
    GameManager.retryNum++;
}
//ウィンドウ読み込み時に実行
window.onload = function () {
    //ゲーム生成
    GameInit();

    // 画像等のロードが終わった後に実行される
    game.onload = function () {
        //メインメソッド
        Main();
    };
    game.start();
};
