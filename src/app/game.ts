import { getServiceByClass } from './services/service-injector.module'
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { TextureManager } from './services/texture-manager/texture-manager.service'
import { SoundManager } from "./services/sound-manager/sound-manager.service";
import { KeyManager } from "./services/keyboard-manager/key-manager.service";
import { Tilemap } from "./tilemap";
import { WebService } from './services/web/web.service';
import { UserProfile } from './services/user-profile/user-profile.service';
import { Camera } from './services/camera/camera';
import { TitleScreen } from './titlescreen';
import { Player } from './player';
const mapData = require('../assets/maps/map1.json')

export class Game {

    // Services
    private pixiManager: PixiManager;
    private soundManager: SoundManager;
    private webService: WebService;
    private userProfile: UserProfile;

    // Managers
    private tileMap: Tilemap = null;

    private titleScreen: TitleScreen = null;
    private player: Player = null;


    constructor() {
        this.pixiManager = getServiceByClass(PixiManager);
        this.soundManager = getServiceByClass(SoundManager);
        this.webService = getServiceByClass(WebService);
        this.userProfile = getServiceByClass(UserProfile);

        this.init();
    }


    scrollFunction(e: WheelEvent) {
        const MAX_ZOOM = 6;
        const MIN_ZOOM = 0.5;
        if (e.deltaY < 0) {
            if (Camera.zoom < MAX_ZOOM) {
                Camera.zoom += 0.01;
            } else {
                Camera.zoom = MAX_ZOOM;
            }
        }
        else {
            if (Camera.zoom > MIN_ZOOM) {
                Camera.zoom -= 0.01;
            } else {
                Camera.zoom = MIN_ZOOM
            }
        }

        console.log(Camera.zoom);
    };

    /**
     * The initial function that runs for the Game object.
     * Called from the App loader class.
     */
    private init() {
        //addEventListener('wheel', this.scrollFunction.bind(this));


        // Event Listeners
        document.addEventListener('titlescreenPlayButtonClicked', this.titleScreenPlayButtonClicked.bind(this));

        // Sets the game loop
        this.pixiManager.setGameLoop(this.gameLoop.bind(this));

        this.titleScreen = new TitleScreen();
        this.titleScreen.display();

        /*
            // TODO Remove - Creates a temporary Tilemap without a "Level" Manager
        */
    }

    titleScreenPlayButtonClicked() {
        this.tileMap = new Tilemap();
        let mapObject = mapData;
        console.log(mapObject)
        this.tileMap.loadLevel(mapObject);
        this.tileMap.showLevel();


        this.player = new Player(this.tileMap.getTileset());
    }

    /**
     * The main game loop - with delta time parameter.
     * @param delta the delta time between each frame
     */
    gameLoop(delta: number) {

        if (this.titleScreen && this.titleScreen.isShowing()) {
            this.titleScreen.update(delta);
            return;
        }

        if (this.pixiManager.getContainer()) {
            //this.pixiManager.getContainer().scale.set(Camera.zoom, Camera.zoom);
            //this.pixiManager.getContainer().position.set(Camera.pos.x, Camera.pos.y);
        }

        if (KeyManager.isKeyPressed('w')) {
            Camera.velocity.y = Camera.speed;
        } else if (KeyManager.isKeyPressed('s')) {
            Camera.velocity.y = -Camera.speed;
        } else {
            Camera.velocity.y = 0;
        }

        if (KeyManager.isKeyPressed('a')) {
            Camera.velocity.x = Camera.speed;
        }
        else if (KeyManager.isKeyPressed('d')) {
            Camera.velocity.x = -Camera.speed;
        } else {
            Camera.velocity.x = 0;
        }

        if (this.tileMap) {
            this.tileMap.update(delta);
            this.tileMap.getContainer().scale.set(Camera.zoom, Camera.zoom);
            this.tileMap.getContainer().position.set(Camera.pos.x, Camera.pos.y);
        }

        if (this.player) {
            this.player.update(delta);
        }


        Camera.update(delta);
    }
}