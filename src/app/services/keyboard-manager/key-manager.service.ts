export class KeyManager {

    private static listOfKeys: string[] = [];

    static KEYS = {
        W: 'w',
        A: 'a',
        S: 's',
        D: 'd',
        SPACE: ' ',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight'
    }

    constructor() {
        this.init();
    }

    private init() {
        document.addEventListener('keydown', KeyManager.keyPressed);
        document.addEventListener('keyup', KeyManager.keyReleased);
    }

    static keyPressed(keyEvent: KeyboardEvent) {
        let key = keyEvent.key;

        if (!KeyManager.listOfKeys.includes(key)) {
            KeyManager.listOfKeys.push(key);
        }
    }

    static keyReleased(keyEvent: KeyboardEvent) {
        let key = keyEvent.key;
        if (KeyManager.listOfKeys.includes(key)) {
            for (let i = 0; i < KeyManager.listOfKeys.length; ++i) {
                if (KeyManager.listOfKeys[i] === key) {
                    KeyManager.listOfKeys.splice(i, 1);
                    return;
                }
            }
        }
    }

    static getKeyList() { return KeyManager.listOfKeys; }

    static isKeyPressed(key: string): boolean {
        return KeyManager.getKeyList().includes(key);
    }
}