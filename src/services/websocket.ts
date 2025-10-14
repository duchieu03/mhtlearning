import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

type MessageHandler = (data: any) => void;

export class PaymentWebSocket {
  private stompClient: Client | null = null;
  private endpoint: string;
  private description: string;
  private messageHandlers: MessageHandler[] = [];

  constructor(description: string, endpoint?: string) {
    this.description = description;
    this.endpoint = endpoint || import.meta.env.VITE_ENDPOINT + '/ws';
  }

  connect() {
    if (this.stompClient?.connected) {
      console.log("⚠️ WebSocket already connected.");
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.endpoint),
      debug: () => {}, 
    });

    this.stompClient.onConnect = (frame) => {
      console.log("✅ STOMP connected:", frame.headers["server"] || "OK");

      // Đăng ký kênh riêng của user
      const destination = `/user/queue/payment-status/${this.description}`;
      console.log("📡 Subscribing to:", destination);

      this.stompClient?.subscribe(destination, (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body);
          console.log("📩 Received:", payload);
          this.messageHandlers.forEach((handler) => handler(payload));
        } catch (error) {
          console.error("❌ Error parsing message:", error);
        }
      });
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    this.stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    this.stompClient.onDisconnect = () => {
      console.log("🔌 WebSocket disconnected.");
    };

    this.stompClient.activate();
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.messageHandlers = [];
      console.log("🔌 WebSocket connection closed.");
    }
  }
}
