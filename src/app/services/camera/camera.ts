export class Camera {

    public static zoom: number = 1.52;
    public static speed: number = 3.0;
    public static pos = {
        x: 0,
        y: 0
    };
    public static velocity = {
        x: 0,
        y: 0
    };

    constructor() {
        this.init();
    }

    private init() {

    }

    static update(delta: number) {
        Camera.pos.x += Camera.velocity.x * delta;
        Camera.pos.y += Camera.velocity.y * delta;
    }
}