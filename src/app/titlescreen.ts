import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";

export class TitleScreen {

    private visible: boolean = false;
    private pixiManager: PixiManager = null;
    private container: Container = null;
    private background: Sprite = null;
    

    constructor() {
        this.init();
    }

    init() {
        this.pixiManager = getServiceByClass(PixiManager);
        this.container = new Container();
        this.background = Sprite.from('assets/titlescreen.png');
    }

    display() {
        this.visible = true;
        if (!this.container.children.includes(this.background)) {
            this.container.addChild(this.background);
        }
        this.pixiManager.addChild(this.container);
    }

    hide() {
        this.visible = false;
        if (this.container.children.includes(this.background)) {
            this.container.removeChild(this.background);
        }
        this.pixiManager.removeChild(this.container);
    }

    isShowing(): boolean {
        return this.visible;
    }

    playButtonClicked() {
        document.dispatchEvent(new CustomEvent("titlescreenPlayButtonClicked"));
    }
}