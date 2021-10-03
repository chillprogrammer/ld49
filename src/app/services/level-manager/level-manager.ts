import { Tilemap } from "../../tilemap";
const map1Data = require('../../../assets/maps/map1.json')

export class LevelManager {

    private levelList: Tilemap[] = [];
    private currentTilemap: Tilemap = null;

    constructor() {

    }

    loadLevels(): void {
        let tileMap = new Tilemap();
        tileMap.loadLevel(map1Data);
        this.levelList.push(tileMap)
    }

    chooseLevel(level: number): Tilemap {
        this.levelList[level].showLevel();
        this.currentTilemap = this.levelList[level];
        return this.currentTilemap;
    }

    getCurrentLevelTilemap(): Tilemap {
        return this.currentTilemap;
    }
}