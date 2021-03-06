import { Sprite, Container } from "pixi.js";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import * as overworld_tileset from '../assets/tilesets/Tileset.json';
import { Tileset } from "./tileset";
import { Player } from "./player";
import { PixelateFilter } from "@pixi/filter-pixelate";

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
    private gameWinTiles: number[] = [];

    // Utility Variables
    private visible: boolean = false;

    private tilesFalling: Sprite[] = [];
    private tileFallSpeed = 0.5;

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

        for (let i = 3521; i <= 3534; i++) {
            for (let j = 0; j <= 4; j++) {
                this.gameWinTiles.push(i + (j * 32));
            }
        }
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
        this.tilesFalling = [];
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

    reset() {
        this.tilemapContainer.removeChildren();
        this.tileIDList = [];
        this.loadLevel(this.tileMap);
    }

    update(delta: number, player?: Player) {
        
        for (let i = 0; i < this.tilemapContainer.children.length; i++) {
            let spriteTile: Sprite = <Sprite>this.tilemapContainer.children[i];
            if (this.tilesFalling.includes(spriteTile)) {
                spriteTile.position.y += this.tileFallSpeed * delta;
            }
        }

        if (player) {
            let collision = false;
            for (let i = 0; i < this.tilemapContainer.children.length; ++i) {
                let tile: Sprite = <Sprite>(this.tilemapContainer.children[i]);
                let tileID: number = this.tileIDList[i];
                if (PixiManager.boxCollision(player.getContainer(), <Sprite>tile)) {
                    if (tileID != 0) {
                        collision = true;

                        if (this.gameWinTiles.includes(tileID)) {
                            player.win();
                        } else {
                            if (player.hasMoved) {
                                this.tilesFalling.push(tile);
                            }
                        }
                    }
                }
            }
            if (!collision) {
                player.dead();
                let pixelFilter = new PixelateFilter();
                pixelFilter.size = 0.5;
                this.tilemapContainer.filters = [pixelFilter];
            }
        }
    }

}