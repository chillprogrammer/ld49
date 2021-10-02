import { Container } from "@pixi/display";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Camera } from "./services/camera/camera";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";

export enum ANIMATION_FRAMES {
    IDLE_UP_LEFT,
    IDLE_UP_RIGHT,
    IDLE_DOWN_LEFT,
    IDLE_DOWN_RIGHT,

    RUN_LEFT,
    RUN_UP_LEFT,
    RUN_RIGHT,
    RUN_UP_RIGHT
};

export enum DIRECTON {
    UP = 1,
    DOWN = 2,
    LEFT = 4,
    RIGHT = 8
};

export class Player {

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


    // Services
    private textureManager: TextureManager = null;
    private pixiManager: PixiManager = null;

    private tileset: Tileset = null;

    private playerContainer: Container = null;

    constructor(tSet: Tileset) {
        this.tileset = tSet;

        this.init();
    }

    getContainer(): Container { return this.playerContainer; }

    init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);

        this.loadSprites();
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_LEFT);

        this.playerContainer.x = PixiManager.INITIAL_WIDTH / 2;
        this.playerContainer.y = PixiManager.INITIAL_HEIGHT / 2;
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

    loadSprites(): void {
        this.playerContainer = new Container();
        this.pixiManager.addChild(this.playerContainer);

        // IDLE UP LEFT
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1154));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1155));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1186));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1187));
        this.idleSpriteUpLeft[0].x = this.idleSpriteUpLeft[0].x
        this.idleSpriteUpLeft[1].x = this.idleSpriteUpLeft[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[2].y = this.idleSpriteUpLeft[2].y + this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteUpLeft[3].x = this.idleSpriteUpLeft[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[3].y = this.idleSpriteUpLeft[3].y + this.tileset.getTilesetInterface().tileheight;

        // IDLE UP RIGHT
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1166));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1167));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1198));
        this.idleSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1199));
        this.idleSpriteUpRight[0].x = this.idleSpriteUpRight[0].x
        this.idleSpriteUpRight[1].x = this.idleSpriteUpRight[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpRight[2].y = this.idleSpriteUpRight[2].y + this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteUpRight[3].x = this.idleSpriteUpRight[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpRight[3].y = this.idleSpriteUpRight[3].y + this.tileset.getTilesetInterface().tileheight;

        // IDLE DOWN LEFT
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1250));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1251));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1282));
        this.idleSpriteDownLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1283));
        this.idleSpriteDownLeft[0].x = this.idleSpriteDownLeft[0].x
        this.idleSpriteDownLeft[1].x = this.idleSpriteDownLeft[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownLeft[2].y = this.idleSpriteDownLeft[2].y + this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteDownLeft[3].x = this.idleSpriteDownLeft[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownLeft[3].y = this.idleSpriteDownLeft[3].y + this.tileset.getTilesetInterface().tileheight;

        // IDLE DOWN RIGHT
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1262));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1263));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1294));
        this.idleSpriteDownRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1295));
        this.idleSpriteDownRight[0].x = this.idleSpriteDownRight[0].x
        this.idleSpriteDownRight[1].x = this.idleSpriteDownRight[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownRight[2].y = this.idleSpriteDownRight[2].y + this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteDownRight[3].x = this.idleSpriteDownRight[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteDownRight[3].y = this.idleSpriteDownRight[3].y + this.tileset.getTilesetInterface().tileheight;

        // RUN LEFT
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(770));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(771));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(802));
        this.runSpriteLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(803));
        this.runSpriteLeft[0].x = this.runSpriteLeft[0].x
        this.runSpriteLeft[1].x = this.runSpriteLeft[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteLeft[2].y = this.runSpriteLeft[2].y + this.tileset.getTilesetInterface().tileheight;
        this.runSpriteLeft[3].x = this.runSpriteLeft[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteLeft[3].y = this.runSpriteLeft[3].y + this.tileset.getTilesetInterface().tileheight;

        // RUN RIGHT
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(962));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(963));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(994));
        this.runSpriteRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(995));
        this.runSpriteRight[0].x = this.runSpriteRight[0].x
        this.runSpriteRight[1].x = this.runSpriteRight[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteRight[2].y = this.runSpriteRight[2].y + this.tileset.getTilesetInterface().tileheight;
        this.runSpriteRight[3].x = this.runSpriteRight[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteRight[3].y = this.runSpriteRight[3].y + this.tileset.getTilesetInterface().tileheight;

        // RUN UP LEFT
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(866));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(867));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(898));
        this.runSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(899));
        this.runSpriteUpLeft[0].x = this.runSpriteUpLeft[0].x
        this.runSpriteUpLeft[1].x = this.runSpriteUpLeft[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpLeft[2].y = this.runSpriteUpLeft[2].y + this.tileset.getTilesetInterface().tileheight;
        this.runSpriteUpLeft[3].x = this.runSpriteUpLeft[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpLeft[3].y = this.runSpriteUpLeft[3].y + this.tileset.getTilesetInterface().tileheight;

        // RUN UP RIGHT
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1058));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1059));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1090));
        this.runSpriteUpRight.push(<AnimatedSprite>this.tileset.getSpriteForTile(1091));
        this.runSpriteUpRight[0].x = this.runSpriteUpRight[0].x
        this.runSpriteUpRight[1].x = this.runSpriteUpRight[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpRight[2].y = this.runSpriteUpRight[2].y + this.tileset.getTilesetInterface().tileheight;
        this.runSpriteUpRight[3].x = this.runSpriteUpRight[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.runSpriteUpRight[3].y = this.runSpriteUpRight[3].y + this.tileset.getTilesetInterface().tileheight;

    }

    update(delta: number) {

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

        this.playerContainer.scale.set(Camera.zoom, Camera.zoom);
        this.position.x = Camera.pos.x + PixiManager.INITIAL_WIDTH / 2;
        this.position.y = Camera.pos.y + PixiManager.INITIAL_HEIGHT / 2;

        this.playerContainer.position.set(this.position.x - Camera.pos.x, this.position.y - Camera.pos.y);
    }
}