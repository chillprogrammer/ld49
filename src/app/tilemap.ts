import { AnimatedSprite, Sprite, Container, TilingSprite } from "pixi.js";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import * as overworld_tileset from '../assets/tilesets/Tileset.json'; // TODO remove
import { Tileset } from "./tileset";
import { Camera } from "./services/camera/camera";
import * as PIXI from "pixi.js";
import { Player } from "./player";

interface TiledMapObject {
    backgroundcolor: string,
    compressionlevel: number,
    editorsettings:
    {
        export:
        {
            format: string,
            target: string
        }
    },
    height: number,
    infinite: boolean,
    layers: [
        {
            data: number[],
            height: number,
            id: number,
            name: string,
            opacity: number,
            type: string,
            visible: boolean,
            width: number,
            x: number,
            y: number
        }
    ],
    nextlayerid: number,
    nextobjectid: number,
    orientation: string,
    renderorder: string,
    tiledversion: string,
    tileheight: number,
    tilesets: [
        {
            firstgid: number,
            source: string
        }],
    tilewidth: number,
    type: string,
    version: string,
    width: number
}

export class Tilemap {

    // Services
    private textureManager: TextureManager;
    private pixiManager: PixiManager;

    // TileMap Objects
    private tilemapContainer: Container = null;
    private tileIDList: number[] = [];
    private tileMap: TiledMapObject = null;
    private tileset: Tileset = null;

    // Utility Variables
    private visible: boolean = false;

    constructor() {
        this.init();
    }

    private init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);
        this.tilemapContainer = new Container();
        //this.tilemapContainer.scale.set(3, 3);

        // TODO make dynamic to use webservice
        this.tileset = new Tileset();
        this.tileset.loadTileset(overworld_tileset as any)
    }

    getTileset(): Tileset { return this.tileset; }

    getContainer(): Container { return this.tilemapContainer; }

    /**
     * Cleans up the enire stored TileMap array & sprites inside.
     */
    cleanUp() {
        this.tileMap = null;
        this.pixiManager.removeChild(this.tilemapContainer);
        this.tilemapContainer.destroy();
        this.tilemapContainer = null;
    }

    getWidth(): number { return this.tileMap ? this.tileMap.width : 0; }
    getHeight(): number { return this.tileMap ? this.tileMap.height : 0; }

    /**
     * Creates the TileMap based on the provided Level array.
     * @param mapPath a 2D array of string IDs.
     */
    loadLevel(map: TiledMapObject) {
        if (map) {
            this.textureManager.loadTileSetIntoMemory(this.tileset.getTilesetInterface() as any);
            this.tileMap = map;
            this.pixiManager.getApp().renderer.backgroundColor = parseInt(this.tileMap.backgroundcolor.replace('#', '0x'));
            for (let i = 0; i < this.tileMap.layers.length; ++i) {
                let layer = this.tileMap.layers[i];
                if (layer.visible) {
                    const LAYER_WIDTH = layer.width;
                    let row = 0;
                    for (let j = 0; j < layer.data.length; ++j) {
                        if (j % LAYER_WIDTH === 0 && j !== 0) {
                            row++;
                        }
                        let tileId = layer.data[j];
                        let tileSprite = this.tileset.getSpriteForTile(tileId);
                        tileSprite.x = (j % LAYER_WIDTH) * map.tilewidth;
                        tileSprite.y = row * map.tileheight;
                        this.tilemapContainer.addChild(tileSprite);
                        this.tileIDList.push(tileId);
                    }
                }
            }
        }
    }

    showLevel() {
        if (!this.visible) {
            this.visible = true;
            this.pixiManager.addChild(this.tilemapContainer);
        }
    }

    hideLevel() {
        if (this.visible) {
            this.visible = false;
            this.pixiManager.removeChild(this.tilemapContainer);
        }
    }

    update(delta: number, player?: Player) {
        if (player) {
            let collision = false;
            for (let i = 0; i < this.tilemapContainer.children.length; ++i) {
                let tile: Sprite = <Sprite>(this.tilemapContainer.children[i]);
                let tileID: number = this.tileIDList[i];
                if (PixiManager.boxCollision(player.getContainer(), <Sprite>tile)) {
                    //tile.tint=0xff0000;
                    if (tileID != 0) {
                        collision = true;
                    }
                }
            }
            if (!collision) {
                player.dead();
            }
        }
    }

}