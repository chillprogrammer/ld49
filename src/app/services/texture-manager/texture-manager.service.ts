import * as PIXI from "pixi.js"
import { Texture } from "pixi.js";
import * as overworld_tileset from '../../../assets/tilesets/Overworld.json'; // TODO remove
import { TilesetInterface } from "../../tileset";

const ASSET_FOLDER_PATH = 'assets';

interface TextureObject {
    path: string,
    texture: PIXI.Texture
}

export class TextureManager {

    private textureList: TextureObject[] = [];
    private tileSetList: TilesetInterface[] = [];

    constructor() {
        this.init();
    }

    private init() {
        this.loadTileSetIntoMemory(overworld_tileset as any);
    }

    /**
     * Loads a texture into memory to speed up getTexture() calls later.
     * @param path the path of the image file to load.
     */
    loadTextureIntoMemory(path: string): void {
        let texture = PIXI.Texture.from(`${ASSET_FOLDER_PATH}/${path}`);
        this.textureList.push({ path: path, texture: texture })
    }

    loadTileSetIntoMemory(tileSet: TilesetInterface): void {
        let texture = PIXI.Texture.from(`${ASSET_FOLDER_PATH}/tilesets/${tileSet.image}`);
        tileSet.path = tileSet.image;
        tileSet.textures = [];

        // Assign the list of textures to the texture array.
        const COLUMN_COUNT = tileSet.columns;
        const TILE_WIDTH = tileSet.tilewidth;
        const TILE_HEIGHT = tileSet.tileheight;
        const TILE_COUNT = tileSet.tilecount;
        let row = 0;
        for (let i = 0; i < TILE_COUNT; ++i) {
            if (i % COLUMN_COUNT === 0 && i !== 0) {
                row++;
            }
            let rect = new PIXI.Rectangle((i % (COLUMN_COUNT)) * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            let tileTexture: Texture = new Texture(texture.baseTexture, rect);
            tileTexture.baseTexture.mipmap= PIXI.MIPMAP_MODES.OFF;
            tileTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            tileSet.textures.push(tileTexture);
        }
        this.tileSetList.push(tileSet);
    }
    getTextureFromTileset(path: string, index: number): PIXI.Texture {
        if (index === 0) {
            return null;
        }

        for (let i = 0; i < this.tileSetList.length; ++i) {
            if (this.tileSetList[i].image === path) {
                return this.tileSetList[i].textures[index - 1];
            }
        }
        return null;
    }

    removeTileSetFromMemory(path: string): void {
        for (let i = 0; i < this.tileSetList.length; ++i) {
            let tileSet = this.tileSetList[i];
            if (tileSet.path === path) {
                for (let j = 0; j < tileSet.textures.length; ++j) {
                    tileSet.textures[i].destroy();
                    tileSet.textures.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**
     * Removes a texture from memory (if it exists in memory).
     * @param path the path of the image file to load.
     */
    removeTextureFromMemory(path: string): void {
        for (let i = 0; i < this.textureList.length; ++i) {
            let element = this.textureList[i];
            if (element.path === path) {
                this.textureList[i].texture.destroy();
                this.textureList.splice(i, 1)
                return;
            }
        }
    }

    /**
     * Returns a texture based on the image path provided. (from memory if already loaded, otherwise it loads from the disk, and adds to memory).
     * @param path the path to the image used as a texture
     * @returns a PIXI.Texture, or null if unavailable.
     */
    getTexture(path: string): PIXI.Texture {

        // Checks loaded texture list first. Returns if texture is found in memory.
        for (let i = 0; i < this.textureList.length; ++i) {
            let element = this.textureList[i];
            if (path === element.path) {
                return element.texture;
            }
        }

        // Since the texture has not been loaded. We load it from the disk, and then return that texture.
        this.loadTextureIntoMemory(path);
        return PIXI.Texture.from(`${ASSET_FOLDER_PATH}/${path}`);
    }
}