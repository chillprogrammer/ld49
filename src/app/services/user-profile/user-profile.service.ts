export class UserProfile {

    // Member Variables
    private username: string = '';
    private accessToken: string = '';

    constructor() {
        this.init();
    }

    private init() {

    }

    public setUserName(username: string) {
        this.username = username;
    }

    public setAccessToken(token: string) {
        this.accessToken = token;
    }
}