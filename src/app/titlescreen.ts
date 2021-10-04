import { Filter, Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { RGBSplitFilter } from "@pixi/filter-rgb-split";
import { Sprite } from "@pixi/sprite";
import { Application, filters, Text } from 'pixi.js';
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";

export class TitleScreen {

    private visible: boolean = false;
    private pixiManager: PixiManager = null;
    private textureManager: TextureManager = null;
    private container: Container = null;
    private background: Sprite = null;
    private playButton: Sprite = null;
    private playText: Text = null;
    private titleText: Text = null;
    private titleAngle: number = 0;
    private rotateFlag: number = 1;
    private app: Application = null;

    private TITLE_COLOR: number = 0xFFD700;
    private BUTTON_COLOR_HOVER: number = 0xFF0000;
    private BUTTON_COLOR: number = 0x111111;


    constructor() {
        this.init();
    }

    init() {

        this.pixiManager = getServiceByClass(PixiManager);
        this.textureManager = getServiceByClass(TextureManager);
        this.app = this.pixiManager.getApp();

        this.container = new Container();
        this.background = Sprite.from('assets/titlescreen.png');
        this.container.addChild(this.background);

        this.playButton = Sprite.from(Texture.WHITE);
        this.playButton.tint = this.BUTTON_COLOR;
        this.playButton.alpha = 0.5
        this.playButton.scale.set(PixiManager.INITIAL_WIDTH / 42, 5);
        this.playButton.position.set(PixiManager.INITIAL_WIDTH / 2 - this.playButton.width + 35, PixiManager.INITIAL_HEIGHT / 1.3);
        (<any>this.playButton).interactive = true;
        this.container.addChild(this.playButton);

        this.playText = new Text('Press To Play', { fontSize: 42, fill: 0xff1010, align: 'center' });
        this.playText.position.set(this.playButton.position.x + this.playButton.width / 2 - this.playText.width / 2, this.playButton.position.y + this.playButton.height / 2 - this.playText.height / 2);
        this.container.addChild(this.playText);

        this.titleText = new Text('GLITCH DRIVE', { fontSize: 73, fill: this.TITLE_COLOR, align: 'center' });
        this.titleText.zIndex = 10;
        this.titleText.style.dropShadow = true;
        this.titleText.style.dropShadowDistance = 4;
        this.titleText.style.dropShadowColor = '0x222222';
        this.titleText.x = PixiManager.INITIAL_WIDTH / 2;
        this.titleText.y = PixiManager.INITIAL_HEIGHT / 4.5;
        this.titleText.anchor.x = 0.5
        this.container.addChild(this.titleText);

        const rgbSplitFilter = new RGBSplitFilter();
        this.container.filters = [rgbSplitFilter];

        //const displacementFilter: 
        //this.container.filters = [rgbSplitFilter];
        const displacementSprite = Sprite.from('./assets/displacement.png');
        const dispFilter = new filters.DisplacementFilter(displacementSprite, 50);
        this.titleText.filters = [rgbSplitFilter, dispFilter]
        this.mouseHandlers();
    }

    mouseHandlers() {
        (<any>this.playButton).on('mouseover', this.switchSprite.bind(this));
        (<any>this.playButton).on('mouseout', this.revertSprite.bind(this));
        (<any>this.playButton).on('click', this.playButtonClicked.bind(this));
    }

    switchSprite = (event: MouseEvent) => {
        //this.playButton.texture = this.textureManager.getTexture("newGameOver.png");
        this.playButton.tint = this.BUTTON_COLOR_HOVER;
        this.playText.tint = this.BUTTON_COLOR;
    }
    revertSprite = (event: MouseEvent) => {
        //this.playButton.texture = this.textureManager.getTexture("newGame.png");
        this.playButton.tint = this.BUTTON_COLOR;
        this.playText.tint = this.BUTTON_COLOR_HOVER;
    }

    display() {
        this.visible = true;
        this.pixiManager.addChild(this.container);
    }

    hide() {
        this.visible = false;
        this.pixiManager.removeChild(this.container);
    }

    isShowing(): boolean {
        return this.visible;
    }

    playButtonClicked() {
        this.hide();
        document.dispatchEvent(new CustomEvent("titlescreenPlayButtonClicked"));
    }

    update(delta: number) {
        const maxRight: number = 5;
        const maxLeft: number = -5;
        const rotateSpeed = 0.05*delta;

        if (this.rotateFlag === 1) {
            this.titleAngle += rotateSpeed;
            this.titleText.angle = this.titleAngle;
        }
        else if (this.rotateFlag === 0) {
            this.titleAngle -= rotateSpeed;
            this.titleText.angle = this.titleAngle;
        }

        if (this.titleAngle > maxRight) {
            this.rotateFlag = 0;
            this.titleAngle = maxRight;
        }
        else if (this.titleAngle < maxLeft) {
            this.rotateFlag = 1;
            this.titleAngle = maxLeft;
        }
    }
}