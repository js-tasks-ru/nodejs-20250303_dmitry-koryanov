import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { Message } from "./entities/message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { JwtModule } from "@nestjs/jwt";
import { ChatController } from "./chat.controller";
import { JwtStrategy } from "../auth/passport/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    PassportModule,
    JwtModule.register({
      secret: "killer-is-jim",
      signOptions: { expiresIn: "24h" },
      global: true,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, JwtStrategy],
})
export class ChatModule {}
