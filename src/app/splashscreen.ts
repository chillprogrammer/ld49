import * as PIXI from "pixi.js"
import { getServiceByClass } from "./services/service-injector.module";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { TextureManager } from './services/texture-manager/texture-manager.service'
import { SoundManager } from "./services/sound-manager/sound-manager.service";

export class SplashScreen {
    private pixiManager: PixiManager;
    private textureManager: TextureManager;
    private soundManager: SoundManager;
    private sprite: PIXI.Sprite;
    private currentlyBeingDisplayed: boolean = false;

    constructor() {
        this.init();
    }

    private init() {
        this.pixiManager = getServiceByClass(PixiManager);
        this.textureManager = getServiceByClass(TextureManager);
        this.soundManager = getServiceByClass(SoundManager);
        //this.app = this.pixiManager.getApp();
        this.sprite = new PIXI.Sprite(this.textureManager.getTexture("default.jpg"));
        this.sprite.scale.set(1, 1);
    }

    display() {
        if (!this.currentlyBeingDisplayed) {
            this.pixiManager.addChild(this.sprite);
        }
    }

    hide() {
        if (this.currentlyBeingDisplayed) {
            this.pixiManager.removeChild(this.sprite);
        }
    }

    cleanUp() {
        if (this.currentlyBeingDisplayed) {
            this.pixiManager.removeChild(this.sprite);
        }
        this.sprite.destroy();
        this.sprite = null;
        this.textureManager.removeTextureFromMemory("default.jpg");
    }


    /**
     * This function loads any resources into memory.
     */
    loadResources(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.loadTextures().then(() => {
                this.loadSounds().then(() => {
                    setTimeout(() => {
                        resolve(null);
                    }, 0);
                }, (err) => {
                    reject(null)
                });
            }, (err) => {
                reject(null);
            });
        })
    }

    /**
     * This function loads any textures into memory.
     */
    loadTextures(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }

    /**
    * This function loads any sounds into memory.
    */
    loadSounds(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }

}