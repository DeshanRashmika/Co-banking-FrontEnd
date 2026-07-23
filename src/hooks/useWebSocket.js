import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useWebSocket = (userId, onNotificationReceived) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket Connection Established Successfully!');

                client.subscribe(`/user/${userId}/topic/notifications`, (message) => {
                    if (message.body) {
                        const payload = JSON.parse(message.body);
                        onNotificationReceived(payload);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Protocol Error:', frame.headers['message']);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [userId]);

    return stompClientRef;
};