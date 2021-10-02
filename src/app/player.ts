import { AnimatedSprite } from "@pixi/sprite-animated";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";

export class Player {

    private activeSprite: AnimatedSprite = null;
    
    // IDLE Sprites
    private idleSpriteUpLeft: AnimatedSprite = null;
    private idleSpriteUpRight: AnimatedSprite = null;
    private idleSpriteDownLeft: AnimatedSprite = null;
    private idleSpriteDownRight: AnimatedSprite = null;

    // Services
    private textureManager: TextureManager = null;

    constructor() {
        this.init();
    }

    init() {
        this.textureManager = getServiceByClass(TextureManager);

        this.loadSprites();
        this.activeSprite = this.idleSpriteUpLeft;
    }

    loadSprites(): void {

    }

    update(delta: number) {

    }
}