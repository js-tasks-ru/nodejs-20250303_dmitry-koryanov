import { ChatService } from "./chat.service";
import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get("history")
  @UseGuards(AuthGuard("jwt"))
  history(@Request() request) {
    return this.chatService.find();
  }
}
