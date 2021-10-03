import * as PIXI from "pixi.js"
import { Container, Sprite } from "pixi.js";

export class PixiManager {

    public static INITIAL_WIDTH = 960;
    public static INITIAL_HEIGHT = 540;
    private app: PIXI.Application;

    private container: Container = null;

    constructor() {
        this.init();
    }

    private init() {

        //Sets the onResizeCallback
        window.onresize = this.onResizeCallback.bind(this);

        //Initialize Pixi.js
        this.initializePixiJs();

        this.container = new Container();
        this.container.sortableChildren = true;
        this.app.stage.addChild(this.container);
    }

    getApp(): PIXI.Application { return this.app; }
    getContainer(): Container { return this.container; }
    
    addChild(child: any) {
        this.container.addChild(child);
    }
    removeChild(child: any) {
        this.container.removeChild(child);
    }

    setGameLoop(functionToRun: any) {
        this.app.ticker.add(delta => functionToRun(delta));
    }

    static boxCollision(c1: Container | Sprite, c2: Container | Sprite) {
        var ab = c1.getBounds();
        var bb = c2.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    /**
    * Creates the Pixi.js canvas, and adds it to the HTML document.
    */
    initializePixiJs() {
        let type = "WebGL"
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas"
        }
        PIXI.utils.skipHello();

        //Create a Pixi Application
        let startParams: PIXI.IApplicationOptions = {
            backgroundColor: 0x000000,
            antialias: false
        }
        this.app = new PIXI.Application(startParams);

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.CLAMP;
        PIXI.settings.ROUND_PIXELS = true;

        //Add the pixi.js canvas to the HTML document
        document.body.appendChild(this.app.view);

        // Force the onResizeEvent to occur.
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Callback function that runs when the window is resized.
     * Resizes the pixi.js canvas to maintain aspect ratio.
     * @param ev the window.resize event
     */
    onResizeCallback(ev: UIEvent) {
        if (this.app) {
            const w = ev.target as Window;
            const width = w.innerWidth;
            const height = w.innerHeight;

            this.app.renderer.view.style.position = "absolute";
            this.app.renderer.view.style.display = "block";

            //Calculates what the Width & Height should be to fit the same aspect ratio on the screen.
            const resolutionRatio = PixiManager.INITIAL_WIDTH / PixiManager.INITIAL_HEIGHT;
            let calculatedWidth = width;
            let calculatedHeight = width / resolutionRatio;
            if (calculatedHeight > height) {
                calculatedHeight = height;
                calculatedWidth = calculatedHeight * resolutionRatio;
            }
            calculatedWidth = Math.ceil(calculatedWidth);
            calculatedHeight = Math.ceil(calculatedHeight);

            //This sets the game's dimensions to what we calculated.
            this.app.renderer.resize(calculatedWidth, calculatedHeight);
            const ratio = Math.min(width / PixiManager.INITIAL_WIDTH, height / PixiManager.INITIAL_HEIGHT);
            this.app.stage.scale.set(ratio);
        }
    }
}