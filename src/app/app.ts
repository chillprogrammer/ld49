import { Game } from "./game"
import { SplashScreen } from "./splashscreen";

export class App {

    /**
     * Initializes everything in the app.
     */
    init() {
        // Displays the splash screen for time specified in ms.
        // After the time passes, the game initializes. Splashscreen hides automatically.
        let splashScreen = new SplashScreen();
        splashScreen.display();
        splashScreen.loadResources().then(() => {
            splashScreen.hide();
            splashScreen.cleanUp();
            splashScreen = null;
            new Game();
        });
    }
}