import { Global, HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  sendEmail(to: string, subject: string, message: string): void {
    this.checkContactInformation(to);
    console.log(`Email sent to ${to}: [${subject}] ${message}`);
  }

  sendSMS(to: string, message: string): void {
    this.checkContactInformation(to);
    console.log(`SMS sent to ${to}: ${message}`);
  }

  private checkContactInformation(to: string): void {
    if (!to) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
  }
}
