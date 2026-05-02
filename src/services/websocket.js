import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8081/ws';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
    }

    connect(onConnect) {
        if (this.connected) {
            if (onConnect) onConnect();
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            this.connected = true;
            console.log('Connected to WebSocket');
            if (onConnect) onConnect();
            
            // Re-subscribe to all active subscriptions after reconnect
            this.subscriptions.forEach((subInfo, topic) => {
                const stompSub = this.client.subscribe(topic, (message) => {
                    subInfo.callback(JSON.parse(message.body));
                });
                subInfo.stompSub = stompSub;
            });
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
            this.subscriptions.clear();
        }
    }

    subscribe(topic, callback) {
        if (this.subscriptions.has(topic)) {
            this.unsubscribe(topic); // Ensure no duplicate STOMP subscriptions
        }
        
        const subInfo = { callback, stompSub: null };
        this.subscriptions.set(topic, subInfo);
        
        if (this.connected && this.client) {
            subInfo.stompSub = this.client.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
            return subInfo.stompSub;
        }
        return null;
    }

    unsubscribe(topic) {
        const subInfo = this.subscriptions.get(topic);
        if (subInfo && subInfo.stompSub) {
            subInfo.stompSub.unsubscribe();
        }
        this.subscriptions.delete(topic);
    }

    sendMessage(destination, body) {
        if (this.connected && this.client) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body),
            });
        } else {
            console.error('Cannot send message, WebSocket not connected');
        }
    }
}

export const wsService = new WebSocketService();
