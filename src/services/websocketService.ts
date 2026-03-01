import { WS_BASE_URL } from './api';

export type WebSocketEventType = 
  | 'notification'
  | 'post_update'
  | 'comment_new'
  | 'like'
  | 'follow'
  | 'community_update'
  | 'online_status';

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: unknown;
  timestamp: string;
}

type EventCallback = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private isConnecting = false;
  private token: string | null = null;
  private intentionalDisconnect = false;
  private realtimeEnabled = import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false';

  connect(token: string) {
    if (!this.realtimeEnabled) {
      return;
    }

    if (token.startsWith('mock-token-')) {
      // Mock auth runs offline and should not attempt real-time socket connection.
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.token = token;
    this.isConnecting = true;
    this.intentionalDisconnect = false;

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}?token=${token}`);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.sendHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.debug('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.ws = null;
        if (!this.intentionalDisconnect) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.debug('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    this.intentionalDisconnect = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
  }

  private attemptReconnect() {
    if (!this.realtimeEnabled) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }

  private sendHeartbeat() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'heartbeat' }));
      setTimeout(() => this.sendHeartbeat(), 30000); // Every 30 seconds
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Error in WebSocket callback:', error);
        }
      });
    }
  }

  on(event: WebSocketEventType, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  off(event: WebSocketEventType, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  send(type: WebSocketEventType, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
