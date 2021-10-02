import { getServiceByClass } from './services/service-injector.module'
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { TextureManager } from './services/texture-manager/texture-manager.service'
import { SoundManager } from "./services/sound-manager/sound-manager.service";
import { KeyManager } from "./services/keyboard-manager/key-manager.service";
import { Tilemap } from "./tilemap";
import { WebService } from './services/web/web.service';
import { UserProfile } from './services/user-profile/user-profile.service';
import { Camera } from './services/camera/camera';
const mapData = require('../assets/maps/map1.json')

export class Game {

    // Services
    private pixiManager: PixiManager;
    private soundManager: SoundManager;
    private webService: WebService;
    private userProfile: UserProfile;

    // Managers
    private tileMap: Tilemap = null;


    constructor() {
        this.pixiManager = getServiceByClass(PixiManager);
        this.soundManager = getServiceByClass(SoundManager);
        this.webService = getServiceByClass(WebService);
        this.userProfile = getServiceByClass(UserProfile);

        this.init();
    }

    /**
     * The initial function that runs for the Game object.
     * Called from the App loader class.
     */
    private init() {

        // Sets the game loop
        this.pixiManager.setGameLoop(this.gameLoop.bind(this));

        // TODO Remove - Creates a temporary Tilemap without a "Level" Manager
        this.tileMap = new Tilemap();

        let mapObject = mapData;
        console.log(mapObject)
        this.tileMap.loadLevel(mapObject);
        this.tileMap.showLevel();
    }

    /**
     * The main game loop - with delta time parameter.
     * @param delta the delta time between each frame
     */
    gameLoop(delta: number) {

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



        Camera.update(delta);

        if (this.tileMap) {
            this.tileMap.update(delta);
        }
    }
}