import { Texture } from "@pixi/core";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Sprite } from "pixi.js";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";

export class Tileset {

    // Services
    private textureManager: TextureManager;
    private pixiManager: PixiManager;

    // Class Variables
    private tileset: TilesetInterface = null;

    constructor() {
        this.init();
    }

    private init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);
    }

    loadTileset(tileset: TilesetInterface) {
        this.tileset = tileset;
    }
    getTilesetInterface(): TilesetInterface {
        return this.tileset;
    }

    getSpriteForTile(tileId: number): Sprite {
        // For animated tiles only, we need to return an AnimatedSprite() with multiple textures.
        let animatedTiles = this.getAnimationsForTile(tileId);
        if (animatedTiles.length > 0) {
            let textureListForTile: Texture[] = [];
            let animationTileDuration = animatedTiles[0].duration ? animatedTiles[0].duration : 150;
            animatedTiles.forEach(animation => {
                let animationTileId = animation.tileid ? animation.tileid+1 : 1;
                textureListForTile.push(this.textureManager.getTextureFromTileset(this.tileset.image, animationTileId));
            });

            let textureArray: any = [];
            textureListForTile.forEach(element => {
                textureArray.push({
                    texture: element,
                    time: animationTileDuration
                })
            });
            
            const animatedSprite = new AnimatedSprite(textureArray, true);
            animatedSprite.animationSpeed = 1;
            animatedSprite.loop = true;
            animatedSprite.play();
            return animatedSprite
        }

        // For NOT-animated tiles, we can return a Sprite() with a single texture
        else {
            return new Sprite(this.textureManager.getTextureFromTileset(this.tileset.image, tileId));
        }
    }

    /**
     * 
     * @returns A list of animations for this tileset's tileID, or an empty array.
     */
    getAnimationsForTile(tileId: number): TileAnimations[] {
        if (this.tileset) {
            const animatedTiles = this.tileset.tiles ? this.tileset.tiles : null;
            if (animatedTiles) {
                if (animatedTiles.length > 0) {
                    for (let i = 0; i < animatedTiles.length; ++i) {
                        let tile = animatedTiles[i];
                        if (tile.id+1 === tileId) {
                            return tile.animation ? tile.animation : [];
                        }
                    }
                }
            }
        }
        return [];
    }
}

export interface TilesetInterface {
    path?: string,
    textures?: Texture[],
    columns: number,
    image: string,
    imageheight: number,
    imagewidth: number,
    margn: number,
    name: string,
    spacing: number,
    tilecount: number,
    tiledversion: string,
    tilewidth: number,
    tileheight: number,
    tiles: TilesetAnimations[],
    type: string,
    version: string
}

interface TilesetAnimations {
    animation: TileAnimations[],
    id: number
}

interface TileAnimations {
    duration: number,
    tileid: number
}
