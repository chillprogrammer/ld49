import { Container } from "@pixi/display";
import { PixelateFilter } from "@pixi/filter-pixelate";
import { ShockwaveFilter } from "@pixi/filter-shockwave";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Camera } from "./services/camera/camera";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";
import { Text } from '@pixi/text'

export enum ANIMATION_FRAMES {
    IDLE_UP_LEFT,
    IDLE_UP_RIGHT,
    IDLE_DOWN_LEFT,
    IDLE_DOWN_RIGHT,

    RUN_LEFT,
    RUN_UP_LEFT,
    RUN_RIGHT,
    RUN_UP_RIGHT,

    JUMP_LEFT,
    JUMP_RIGHT,
    JUMP_UP_DOWN
};

export enum DIRECTON {
    UP = 1,
    DOWN = 2,
    LEFT = 4,
    RIGHT = 8
};

export class Player {

    public alive: boolean = true;
    public jumpAvailable = true;
    public currentlyJumping = false;
    private JUMP_DISTANCE: number = 200;
    private glitchFilter: PixelateFilter;
    private shockwaveFilter: ShockwaveFilter;
    private DEATH_TIME: number = 3000;

    public position = {
        x: 0,
        y: 0
    };
    public velocity = {
        x: 0,
        y: 0
    };

    public direction = 0x00000000;

    // IDLE Sprites
    private idleSpriteUpLeft: AnimatedSprite[] = [];
    private idleSpriteUpRight: AnimatedSprite[] = [];
    private idleSpriteDownLeft: AnimatedSprite[] = [];
    private idleSpriteDownRight: AnimatedSprite[] = [];

    // RUNNING Sprites
    private runSpriteLeft: AnimatedSprite[] = [];
    private runSpriteUpLeft: AnimatedSprite[] = [];
    private runSpriteRight: AnimatedSprite[] = [];
    private runSpriteUpRight: AnimatedSprite[] = [];

    // SPECIAL Sprites
    private jumpLeft: AnimatedSprite[] = [];
    private jumpRight: AnimatedSprite[] = [];
    private jumpUpDown: AnimatedSprite[] = [];


    // Services
    private textureManager: TextureManager = null;
    private pixiManager: PixiManager = null;

    private tileset: Tileset = null;

    private playerContainer: Container = null;
    private playerEffectsContainer: Container = null;
    private youDiedText: Text = null;

    constructor(tSet: Tileset) {
        this.tileset = tSet;

        this.init();
    }

    getContainer(): Container { return this.playerContainer; }

    init() {
        this.direction |= DIRECTON.LEFT;
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);

        this.loadSprites();
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_LEFT);

        this.playerContainer.x = PixiManager.INITIAL_WIDTH / 2;
        this.playerContainer.y = PixiManager.INITIAL_HEIGHT / 2;

        this.playerContainer.scale.set(Camera.zoom, Camera.zoom);

        this.loadFilters();

        this.youDiedText = new Text('YOU DIED', { fontSize: 82, fill: 0xFFD700, align: 'center' });
        this.youDiedText.position.set(PixiManager.INITIAL_WIDTH / 2 - this.youDiedText.width / 2, PixiManager.INITIAL_HEIGHT / 2 - this.youDiedText.height);
        this.youDiedText.style.dropShadow = true;
        this.youDiedText.style.dropShadowDistance = 10;
        this.youDiedText.style.dropShadowColor = '0x222222';
    }

    loadFilters() {
        this.glitchFilter = new PixelateFilter();
        this.shockwaveFilter = new ShockwaveFilter();
    }

    setPlayerAnimation(animationEvent: number) {
        this.playerContainer.removeChildren();

        switch (animationEvent) {
            default:
                for (let i = 0; i < this.idleSpriteUpLeft.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteUpLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.IDLE_UP_RIGHT:
                for (let i = 0; i < this.idleSpriteUpRight.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteUpRight[i]);
                }
                break;

            case ANIMATION_FRAMES.IDLE_DOWN_LEFT:
                for (let i = 0; i < this.idleSpriteDownLeft.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteDownLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.IDLE_DOWN_RIGHT:
                for (let i = 0; i < this.idleSpriteDownRight.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteDownRight[i]);
                }
                break;

            case ANIMATION_FRAMES.RUN_LEFT:
                for (let i = 0; i < this.runSpriteLeft.length; ++i) {
                    this.playerContainer.addChild(this.runSpriteLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.RUN_RIGHT:
                for (let i = 0; i < this.runSpriteRight.length; ++i) {
                    this.playerContainer.addChild(this.runSpriteRight[i]);
                }
                break;

            case ANIMATION_FRAMES.RUN_UP_LEFT:
                for (let i = 0; i < this.runSpriteUpLeft.length; ++i) {
                    this.playerContainer.addChild(this.runSpriteUpLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.RUN_UP_RIGHT:
                for (let i = 0; i < this.runSpriteUpRight.length; ++i) {
                    this.playerContainer.addChild(this.runSpriteUpRight[i]);
                }
                break;

            case ANIMATION_FRAMES.JUMP_LEFT:
                for (let i = 0; i < this.jumpLeft.length; ++i) {
                    if (this.jumpLeft[i].gotoAndPlay) {
                        this.jumpLeft[i].gotoAndPlay(0);
                    }
                    this.playerContainer.addChild(this.jumpLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.JUMP_RIGHT:
                for (let i = 0; i < this.jumpLeft.length; ++i) {
                    if (this.jumpLeft[i].gotoAndPlay) {
                        this.jumpLeft[i].gotoAndPlay(0);
                    }
                    this.playerContainer.addChild(this.jumpLeft[i]);
                }
                break;

            case ANIMATION_FRAMES.JUMP_UP_DOWN:
                for (let i = 0; i < this.jumpUpDown.length; ++i) {
                    if (this.jumpUpDown[i].gotoAndPlay) {
                        this.jumpUpDown[i].gotoAndPlay(0);
                    }
                    this.playerContainer.addChild(this.jumpUpDown[i]);
                }
                break;
        }
    }

    moveUp() {
        Camera.velocity.y = Camera.speed;
        // this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_UP_LEFT);
    }
    moveDown() {
        Camera.velocity.y = -Camera.speed;
        //this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_RIGHT);
    }
    moveLeft() {
        Camera.velocity.x = Camera.speed;
        //this.setPlayerAnimation(ANIMATION_FRAMES.RUN_LEFT);
    }
    moveRight() {
        Camera.velocity.x = -Camera.speed;
        //this.setPlayerAnimation(ANIMATION_FRAMES.RUN_RIGHT);
    }

    jump() {
        if (this.jumpAvailable && (Camera.velocity.x !== 0 || Camera.velocity.y !== 0)) {
            this.jumpAvailable = false;
            this.currentlyJumping = true;

            if (Camera.velocity.y > 0) {
                Camera.pos.y += this.JUMP_DISTANCE;
                this.setPlayerAnimation(ANIMATION_FRAMES.JUMP_UP_DOWN);
            } else if (Camera.velocity.y < 0) {
                Camera.pos.y -= this.JUMP_DISTANCE;
                this.setPlayerAnimation(ANIMATION_FRAMES.JUMP_UP_DOWN);
            }

            if (Camera.velocity.x > 0) {
                Camera.pos.x += this.JUMP_DISTANCE;
                this.setPlayerAnimation(ANIMATION_FRAMES.JUMP_LEFT);
            } else if (Camera.velocity.x < 0) {
                Camera.pos.x -= this.JUMP_DISTANCE;
                this.setPlayerAnimation(ANIMATION_FRAMES.JUMP_UP_DOWN);


            }
        }
    }

    dead() {
        this.alive = false;
        if (!this.pixiManager.getContainer().children.includes(this.youDiedText)) {
            this.pixiManager.addChild(this.youDiedText);

            setTimeout(() => {
                if (this.pixiManager.getContainer().children.includes(this.youDiedText)) {
                    this.pixiManager.removeChild(this.youDiedText);
                }
                this.alive = true;
                console.log("ALIVE")
                Camera.pos.x = 0;
                Camera.pos.y = 0;
                this.playerContainer.filters = [];
                document.dispatchEvent(new CustomEvent("deadNoLonger"));
            }, this.DEATH_TIME);
        }

        this.playerContainer.filters = [this.glitchFilter];
    }

    loadSprites(): void {
        this.playerContainer = new Container();
        this.playerEffectsContainer = new Container();
        this.pixiManager.addChild(this.playerContainer);
        this.pixiManager.addChild(this.playerEffectsContainer);

        // IDLE UP LEFT
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1154));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1155));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1186));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1187));
        this.idleSpriteUpLeft[0].x = this.idleSpriteUpLeft[0].x;
        this.idleSpriteUpLeft[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[2].y = this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteUpLeft[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[3].y = this.tileset.getTilesetInterface().tileheight;

        // IDLE UP RIGHT
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1166));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1167));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1198));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1199));
        this.idleSpriteUpRight[0].x = this.idleSpriteUpRight[0].x;
        this.idleSpriteUpRight[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpRight[2].y = this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteUpRight[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpRight[3].y = this.tileset.getTilesetInterface().tileheight;

        // IDLE DOWN LEFT
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1250));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1251));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1282));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1283));
        this.idleSpriteDownLeft[0].x = this.idleSpriteDownLeft[0].x;
        this.idleSpriteDownLeft[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownLeft[2].y = this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteDownLeft[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownLeft[3].y = this.tileset.getTilesetInterface().tileheight;

        // IDLE DOWN RIGHT
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1262));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1263));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1294));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1295));
        this.idleSpriteDownRight[0].x = this.idleSpriteDownRight[0].x;
        this.idleSpriteDownRight[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownRight[2].y = this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteDownRight[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownRight[3].y = this.tileset.getTilesetInterface().tileheight;

        // RUN LEFT
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(770));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(771));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(802));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(803));
        this.runSpriteLeft[0].x = this.runSpriteLeft[0].x;
        this.runSpriteLeft[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteLeft[2].y = this.tileset.getTilesetInterface().tileheight;
        this.runSpriteLeft[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteLeft[3].y = this.tileset.getTilesetInterface().tileheight;

        // RUN RIGHT
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(962));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(963));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(994));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(995));
        this.runSpriteRight[0].x = this.runSpriteRight[0].x;
        this.runSpriteRight[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteRight[2].y = this.tileset.getTilesetInterface().tileheight;
        this.runSpriteRight[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteRight[3].y = this.tileset.getTilesetInterface().tileheight;

        // RUN UP LEFT
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(866));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(867));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(898));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(899));
        this.runSpriteUpLeft[0].x = this.runSpriteUpLeft[0].x
        this.runSpriteUpLeft[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpLeft[2].y = this.tileset.getTilesetInterface().tileheight;
        this.runSpriteUpLeft[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpLeft[3].y = this.tileset.getTilesetInterface().tileheight;

        // RUN UP RIGHT
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1058));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1059));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1090));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1091));
        this.runSpriteUpRight[0].x = this.runSpriteUpRight[0].x;
        this.runSpriteUpRight[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpRight[2].y = this.tileset.getTilesetInterface().tileheight;
        this.runSpriteUpRight[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpRight[3].y = this.tileset.getTilesetInterface().tileheight;


        // JUMP LEFT
        this.jumpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1601));
        this.jumpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1602));
        this.jumpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1633));
        this.jumpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1634));
        this.jumpLeft[0].x = this.jumpLeft[0].x;
        this.jumpLeft[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.jumpLeft[2].y = this.tileset.getTilesetInterface().tileheight;
        this.jumpLeft[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.jumpLeft[3].y = this.tileset.getTilesetInterface().tileheight;

        for (let i = 0; i < this.jumpLeft.length; ++i) {
            this.jumpLeft[i].loop = true;
            this.jumpLeft[i].onLoop = () => {
                this.currentlyJumping = false;
                if (this.jumpLeft[i].gotoAndStop) {
                    this.jumpLeft[i].gotoAndStop(0);
                }
            }
        }



        // JUMP RIGHT
        for (let i = 1610; i <= 1616; ++i) {
            this.jumpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(i));
        }
        for (let i = 1642; i <= 1648; ++i) {
            this.jumpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(i));
        }
        for (let i = 0; i < 7; ++i) {
            this.jumpRight[i].x = this.tileset.getTilesetInterface().tilewidth * i;
        }
        for (let i = 7; i < 14; ++i) {
            this.jumpRight[i].x = this.tileset.getTilesetInterface().tilewidth * (i - 8);
            this.jumpRight[i].y = this.tileset.getTilesetInterface().tileheight;
        }
        for (let i = 0; i < this.jumpRight.length; ++i) {
            this.jumpRight[i].loop = true;
            this.jumpRight[i].onLoop = () => {
                this.currentlyJumping = false;
                if (this.jumpRight[i].gotoAndStop) {
                    this.jumpRight[i].gotoAndStop(0);
                }


            }
        }

        // JUMP UP OR DOWN
        this.jumpUpDown.push(<AnimatedSprite>this.tileset.getSpriteForTile(1596));
        this.jumpUpDown.push(<AnimatedSprite>this.tileset.getSpriteForTile(1597));
        this.jumpUpDown.push(<AnimatedSprite>this.tileset.getSpriteForTile(1628));
        this.jumpUpDown.push(<AnimatedSprite>this.tileset.getSpriteForTile(1629));
        this.jumpUpDown[0].x = this.jumpUpDown[0].x
        this.jumpUpDown[1].x = this.tileset.getTilesetInterface().tilewidth;
        this.jumpUpDown[2].y = this.tileset.getTilesetInterface().tileheight;
        this.jumpUpDown[3].x = this.tileset.getTilesetInterface().tilewidth;
        this.jumpUpDown[3].y = this.tileset.getTilesetInterface().tileheight;

        for (let i = 0; i < this.jumpUpDown.length; ++i) {
            this.jumpUpDown[i].loop = true;
            this.jumpUpDown[i].onLoop = () => {
                this.currentlyJumping = false;
                if (this.jumpUpDown[i].gotoAndStop) {
                    this.jumpUpDown[i].gotoAndStop(0);
                }
            }
        }

    }

    update(delta: number) {
        if (!this.currentlyJumping) {
            if (!Camera.velocity.x && !Camera.velocity.y) {
                // IDLE Animations
                if (
                    (this.direction & DIRECTON.LEFT || this.direction & DIRECTON.UP) &&
                    (!(this.direction & DIRECTON.DOWN) && !(this.direction & DIRECTON.RIGHT))
                ) {
                    this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_UP_LEFT);
                }
                else if (
                    (this.direction & DIRECTON.RIGHT || this.direction & DIRECTON.UP) &&
                    (!(this.direction & DIRECTON.DOWN) && !(this.direction & DIRECTON.LEFT))
                ) {
                    this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_UP_RIGHT);
                }
                else if (
                    (this.direction & DIRECTON.LEFT || this.direction & DIRECTON.DOWN) &&
                    (!(this.direction & DIRECTON.UP) && !(this.direction & DIRECTON.RIGHT))
                ) {
                    this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_LEFT);
                }
                else if (
                    (this.direction & DIRECTON.RIGHT || this.direction & DIRECTON.DOWN) &&
                    (!(this.direction & DIRECTON.UP) && !(this.direction & DIRECTON.LEFT))
                ) {
                    this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_RIGHT);
                }
            } else {
                // Moving Animations
                if (this.direction & DIRECTON.LEFT) {
                    if (this.direction & DIRECTON.UP && Camera.velocity.y !== 0) {
                        this.setPlayerAnimation(ANIMATION_FRAMES.RUN_UP_LEFT);
                    } else {
                        this.setPlayerAnimation(ANIMATION_FRAMES.RUN_LEFT);
                    }
                } else {
                    if (this.direction & DIRECTON.RIGHT) {
                        if (this.direction & DIRECTON.UP && Camera.velocity.y !== 0) {
                            this.setPlayerAnimation(ANIMATION_FRAMES.RUN_UP_RIGHT);
                        } else {
                            this.setPlayerAnimation(ANIMATION_FRAMES.RUN_RIGHT);
                        }
                    }
                }
            }
        }

        if (!this.alive) {
            this.setPlayerAnimation(ANIMATION_FRAMES.RUN_RIGHT);
            return;
        }

        this.position.x = Camera.pos.x + PixiManager.INITIAL_WIDTH / 2;
        this.position.y = Camera.pos.y + PixiManager.INITIAL_HEIGHT / 2;

        this.playerContainer.position.set(this.position.x - Camera.pos.x, this.position.y - Camera.pos.y);
        this.playerEffectsContainer.position = this.playerContainer.position;
    }
}