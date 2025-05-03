import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ChatService } from "./chat.service";
import { Message } from "./entities/message.entity";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      client.broadcast.emit("message", {
        username: "System",
        text: `User ${client.data.user.username} joined the chat.`,
        date: new Date().toISOString(),
      });
    } catch (error) {
      return client.disconnect(true);
    }
  }

  @SubscribeMessage("chatMessage")
  async chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { text: string },
  ) {
    const message: Partial<Message> = {
      username: client.data.user.username,
      text: body.text,
      date: new Date(),
    };

    this.server.emit("message", {
      username: message.username,
      text: message.text,
    });

    await this.chatService.create(message);
  }
}
