import { Tilemap } from "../../tilemap";
const map1Data = require('../../../assets/maps/map1.json')
const map2Data = require('../../../assets/maps/map2.json')

export class LevelManager {

    private levelList: Tilemap[] = [];
    private currentTilemap: Tilemap = null;

    constructor() {

    }

    loadLevels(): void {
        let tileMap = new Tilemap();
        tileMap.loadLevel(map1Data);
        this.levelList.push(tileMap)

        let tileMap2 = new Tilemap();
        tileMap2.loadLevel(map2Data);
        this.levelList.push(tileMap2)
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