import { Container } from "@pixi/display";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";

export class laser {
    private activeSprite: AnimatedSprite = null;

    //Animimated sprite
    private laserLeft: AnimatedSprite[] = [];

    // Services
    private textureManager: TextureManager = null;
    private pixiManager: PixiManager = null;

    private tileset: Tileset = null;

    private laserContainer: Container = null;

    constructor(tSet: Tileset) {
        this.tileset = tSet;

        this.init();
    }

    init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);

        this.loadSprites();
    }

    setLaserAnimation(animationEvent: number) {

    }

    loadSprites(): void {

    }

    update(delta: number) {
        
    }

}
