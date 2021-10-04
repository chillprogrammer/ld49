import { Container } from "@pixi/display";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { PixiManager } from "./services/pixi-manager/pixi-manager.service";
import { getServiceByClass } from "./services/service-injector.module";
import { TextureManager } from "./services/texture-manager/texture-manager.service";
import { Tileset } from "./tileset";
import { Camera } from "./services/camera/camera";
import { LevelManager } from "./services/level-manager/level-manager";
import { DIRECTON, Player } from './player';

export enum ANIMATION_FRAMES {
    LASER_1
};

export class laser {


    private activeSprite: AnimatedSprite = null;

    //Animimated sprite; Starts from top left
    private laser1: AnimatedSprite[] = [];


    // Services
    private levelManager : LevelManager = null;
    private textureManager: TextureManager = null;
    private pixiManager: PixiManager = null;

    private tileset: Tileset = null;

    private laserContainer: Container = null;

    constructor(tSet: Tileset) {
        this.tileset = tSet;

        this.init();
    }

    getContainer(): Container { return this.laserContainer; }
    
    
    init() {
        this.textureManager = getServiceByClass(TextureManager);
        this.pixiManager = getServiceByClass(PixiManager);
        this.levelManager = getServiceByClass(LevelManager);

        this.loadSprites();


        
        

        this.laserContainer.scale.y = (2.8)
    }

    setLaserAnimation(animationEvent: number) {
        this.laserContainer.removeChildren();

        switch (animationEvent) {
            default:
                for (let i = 0; i < this.laser1.length; ++i) {
                    this.laserContainer.addChild(this.laser1[i]);
                }
                break;

                case ANIMATION_FRAMES.LASER_1:
                    for (let i = 0; i < this.laser1.length; ++i) {
                        this.laserContainer.addChild(this.laser1[i]);
                    }
                break;

        }
    }

    loadSprites(): void {
        this.laserContainer = new Container();
        this.levelManager.getCurrentLevelTilemap().getContainer().addChild(this.laserContainer);

        // laser 1
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1825));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1826));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1827));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1828));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1857));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1858));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1859));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1860));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1889));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1890));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1891));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1892));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1921));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1922));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1923));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1924));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1953));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1954));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1955));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1956));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1985));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1986));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1987));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(1988));

        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(2017));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(2018));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(2019));
        this.laser1.push(<AnimatedSprite>this.tileset.getSpriteForTile(2020));
        
        let row = -1;
        for(let i = 0; i < this.laser1.length; i++)
        {
            
            if((i) % 4 == 0)
            {
                row++;
            }
            this.laser1[i].y = this.tileset.getTilesetInterface().tileheight * row;
            this.laser1[i].x = this.tileset.getTilesetInterface().tilewidth * (i % 4);
        }

    }

    laserFollow(player: Player)
    {
        /*for (let i = 0; i < this.jumpUpDown.length; ++i) {
            this.jumpUpDown[i].loop = true;
            this.jumpUpDown[i].onLoop = () => {
                this.currentlyJumping = false;
                if (this.jumpUpDown[i].gotoAndStop) {
                    this.jumpUpDown[i].gotoAndStop(0);
                }
            }
        }   */
        this.laserContainer.position.x = ((-Camera.pos.x * Camera.zoom)) / 2 ;
        this.laserContainer.position.y = ((-Camera.pos.y * Camera.zoom)) / 2 ;
        this.setLaserAnimation(ANIMATION_FRAMES.LASER_1)
        for (let i = 0; i < this.laser1.length; ++i) {
            this.laser1[i].loop = true;
            this.laser1[i].play();
            this.laser1[i].onLoop = () => {
                if (this.laser1[i].gotoAndStop) {
                    this.laser1[i].gotoAndStop(0);
                }
            }
        }
    }
    

    update(delta: number) {
        
    }

}
