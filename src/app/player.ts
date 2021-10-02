import { Container } from "@pixi/display";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Camera } from "./services/camera/camera";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";

export enum ANIMATION_FRAMES {
    IDLE_UP_LEFT = 0,
    IDLE_UP_RIGHT = 1,
    IDLE_DOWN_LEFT = 2,
    IDLE_DOWN_RIGHT = 3
};

export class Player {

    public position = {
        x: 0,
        y: 0
    };

    private activeSprite: AnimatedSprite = null;

    // IDLE Sprites
    private idleSpriteUpLeft: AnimatedSprite[] = [];
    private idleSpriteUpRight: AnimatedSprite[] = [];
    private idleSpriteDownLeft: AnimatedSprite[] = [];
    private idleSpriteDownRight: AnimatedSprite[] = [];

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
        //this.playerContainer.scale.set(Camera.zoom * 3);

        //this.activeSprite = this.idleSpriteUpLeft;
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
                for (let i = 0; i < this.idleSpriteUpLeft.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteUpRight[i]);
                }
                break;

            case ANIMATION_FRAMES.IDLE_DOWN_LEFT:
                for (let i = 0; i < this.idleSpriteUpLeft.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteDownLeft[i]);
                }
                break;


            case ANIMATION_FRAMES.IDLE_DOWN_RIGHT:
                for (let i = 0; i < this.idleSpriteUpLeft.length; ++i) {
                    this.playerContainer.addChild(this.idleSpriteDownRight[i]);
                }
                break;

        }
    }

    moveUp() {
        Camera.velocity.y = Camera.speed;
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_UP_LEFT);
    }
    moveDown() {
        Camera.velocity.y = -Camera.speed;
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_RIGHT);
    }
    moveLeft() {
        Camera.velocity.x = Camera.speed;
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_DOWN_LEFT);
    }
    moveRight() {
        Camera.velocity.x = -Camera.speed;
        this.setPlayerAnimation(ANIMATION_FRAMES.IDLE_UP_RIGHT);
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
    }

    update(delta: number) {


        this.playerContainer.scale.set(Camera.zoom, Camera.zoom);
        this.position.x = Camera.pos.x + PixiManager.INITIAL_WIDTH / 2;
        this.position.y = Camera.pos.y + PixiManager.INITIAL_HEIGHT / 2;

        this.playerContainer.position.set(this.position.x - Camera.pos.x, this.position.y - Camera.pos.y);
    }
}