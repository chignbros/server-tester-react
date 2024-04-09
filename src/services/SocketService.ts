import * as StompJs from "@stomp/stompjs";
import {StompConfig} from "@stomp/stompjs";


export class SocketService {

    constructor({token = "", url = "",}) {
        this.token = token;
        this.webSocketEndPoint = url;
        this.stompConfig = {
            connectHeaders: {
                Authorization: this.token
            },
            brokerURL: url,
            reconnectDelay: 100000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 0,
        };
    }


    webSocketEndPoint: string = ""
    stompClient: StompJs.Client | null | undefined;
    stompSubscribe: StompJs.StompSubscription | null | undefined;
    token: string = "";

    stompConfig: StompConfig

    _connect(isSub: boolean, topic?: any, onMessageReceived?: any) {
        if (this.stompClient) return;
        // console.log("Initialize WebSocket Connection");
        this.stompConfig.connectHeaders!.Authorization = this.token ?? "";
        this.stompClient = new StompJs.Client(this.stompConfig);
        this.stompClient.activate();
        this._unsubscribe();
        const _this = this;
        this.stompClient.onConnect = function (frame) {
            isSub && _this._subscribe(topic, onMessageReceived);
        };
    };

    _unsubscribe() {
        if (this.stompSubscribe) {
            this.stompSubscribe.unsubscribe();
            this.stompSubscribe = null;
        }
    }


    _subscribe(topic: string, onMessageReceived: { (ms: any): void; (ms: any): void; (arg0: any): any; }) {
        const _this = this;
        // console.log("start---sub------>", topic)
        setTimeout(() => {
            _this.stompSubscribe = _this.stompClient?.subscribe(topic, function (sdkEvent) {
                // console.log("------", sdkEvent.body)
                onMessageReceived && onMessageReceived(JSON.parse(sdkEvent.body));
            });
        }, 500)
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: string) {
        console.log("socket error -> " + error)
    }

}
