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
import { DIRECTON, Player } from './player';
import { LevelManager } from './services/level-manager/level-manager';
import { Text } from '@pixi/text';


export class Game {

    // Services
    private pixiManager: PixiManager;
    private levelManager: LevelManager;
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
        this.levelManager = getServiceByClass(LevelManager);

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
        document.addEventListener('deadNoLonger', this.respawn.bind(this));
        // Sets the game loop
        this.pixiManager.setGameLoop(this.gameLoop.bind(this));

        this.titleScreen = new TitleScreen();
        this.titleScreen.display();

        this.levelManager.loadLevels();

        /*
            // TODO Remove - Creates a temporary Tilemap without a "Level" Manager
        */
    }

    titleScreenPlayButtonClicked() {
        this.tileMap = this.levelManager.chooseLevel(0);
        this.player = new Player(this.tileMap.getTileset());
    }

    respawn() {
        this.tileMap.getContainer().filters = [];
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

        if (this.player.alive) {
            if (KeyManager.isKeyPressed('w')) {
                this.player.moveUp();
                this.player.direction &= ~DIRECTON.DOWN;
                this.player.direction |= DIRECTON.UP
                /*if(!Camera.velocity.x) {
                    this.player.direction &= ~DIRECTON.LEFT;
                    this.player.direction &= ~DIRECTON.RIGHT;
                }*/
            } else if (KeyManager.isKeyPressed('s')) {
                this.player.moveDown();
                this.player.direction |= DIRECTON.DOWN;
                this.player.direction &= ~DIRECTON.UP;
                /*if(!Camera.velocity.x) {
                    this.player.direction &= ~DIRECTON.LEFT;
                    this.player.direction &= ~DIRECTON.RIGHT;
                }*/
            } else {
                Camera.velocity.y = 0;
            }
            if (KeyManager.isKeyPressed('a')) {
                this.player.moveLeft();
                this.player.direction &= ~DIRECTON.RIGHT;
                this.player.direction |= DIRECTON.LEFT;
                /*if(!Camera.velocity.y) {
                    this.player.direction &= ~DIRECTON.UP;
                    this.player.direction &= ~DIRECTON.DOWN;
                }*/
            }
            else if (KeyManager.isKeyPressed('d')) {
                this.player.moveRight();
                this.player.direction |= DIRECTON.RIGHT;
                this.player.direction &= ~DIRECTON.LEFT;
                /*if(!Camera.velocity.y) {
                    this.player.direction &= ~DIRECTON.UP;
                    this.player.direction &= ~DIRECTON.DOWN;
                }*/
            } else {
                Camera.velocity.x = 0;
            }

            if (KeyManager.isKeyPressed(' ')) {
                this.player.jump();
            } else {
                if (!this.player.currentlyJumping) {
                    this.player.jumpAvailable = true;
                }
            }
        } else {
            Camera.velocity.x = Camera.velocity.y = 0;
        }

        if (this.tileMap) {
            this.tileMap.update(delta, this.player);
            this.tileMap.getContainer().scale.set(Camera.zoom, Camera.zoom);
            this.tileMap.getContainer().position.set(Camera.pos.x, Camera.pos.y);
        }

        if (this.player) {
            this.player.update(delta);
        }


        Camera.update(delta);
    }
}