import { App } from './app/app'

/**
 * Bootstrapper for the App.
 */
function initializeApp() {
    let app = new App();
    app.init();
}
initializeApp();