
export class WebService {

    private API_URL: string = 'http://multiplayergame-env.eba-22vkmtpv.us-east-2.elasticbeanstalk.com';

    constructor() {
        if (location.hostname === 'localhost' || location.hostname === '[::1]' || location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)) {
            this.API_URL = 'http://localhost:3000';
        }
    }

    private sendWebRequest(method: string, endpoint: string, body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, `${this.API_URL}/${endpoint}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;

                var data = this.responseText;
                if (data) {
                    data = JSON.parse(data);
                }

                if (this.status >= 200 && this.status < 300) {
                    resolve(data);
                } else {
                    reject(data);
                }
            };
            xhr.send(JSON.stringify(body));
        })
    }

    getOnLoad(): Promise<string> {
        return this.sendWebRequest("POST", "getOnLoad", {});
    }

    getPublicRooms(): Promise<string> {
        return this.sendWebRequest("POST", "getPublicRooms", {});
    }

    getMapById(mapId: string): Promise<any> {
        return this.sendWebRequest("POST", "maps/getMapById", { mapId: mapId });
    }

}