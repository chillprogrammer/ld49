import * as PIXI from "pixi.js"
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";

export class FxManager {

    private pixiManager: PixiManager = getServiceByClass(PixiManager);

    constructor() {
        this.init();
    }

    private init() {

    }

    cleanUp() {

    }

    update(delta: number) {

    }
}