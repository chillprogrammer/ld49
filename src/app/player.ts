import { Container } from "@pixi/display";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Camera } from "./services/camera/camera";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";
import * as PIXI from 'pixi.js'; 
export class Player {

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

    init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);

        this.loadSprites();
        this.setPlayerAnimation(0);

        this.playerContainer.x = PixiManager.INITIAL_WIDTH/2;
        this.playerContainer.y = PixiManager.INITIAL_HEIGHT/2;
        this.playerContainer.scale.set(Camera.zoom/1.5);

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

            case 1:
                break;

        }
    }

    loadSprites(): void {
        this.playerContainer = new Container();
        this.pixiManager.addChild(this.playerContainer);

        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1154));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1155));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1186));
        this.idleSpriteUpLeft.push(<AnimatedSprite>this.tileset.getSpriteForTile(1187));
        this.idleSpriteUpLeft[0].x = this.idleSpriteUpLeft[0].x
        this.idleSpriteUpLeft[1].x = this.idleSpriteUpLeft[1].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[2].y = this.idleSpriteUpLeft[2].y + this.tileset.getTilesetInterface().tileheight;
        this.idleSpriteUpLeft[3].x = this.idleSpriteUpLeft[3].x + this.tileset.getTilesetInterface().tilewidth;
        this.idleSpriteUpLeft[3].y = this.idleSpriteUpLeft[3].y + this.tileset.getTilesetInterface().tileheight;
        const app = new PIXI.Application();

    // Draw a green rectangle
    const rect = new PIXI.Graphics()
     .beginFill(0x00ff00)
     .drawRect(40, 40, 200, 200);

    // Add a blur filter
    rect.filters = [new PIXI.filters.BlurFilter()];

    // Display rectangle
    app.stage.addChild(rect);
    document.body.appendChild(app.view);
    }

    update(delta: number) {
        
    }
}