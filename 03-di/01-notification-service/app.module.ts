import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [TasksModule, NotificationsModule],
})
export class AppModule {}
