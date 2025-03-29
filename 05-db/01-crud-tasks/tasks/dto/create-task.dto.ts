import { Column } from "typeorm";

export class CreateTaskDto {
  title: string;
  description: string;
  isCompleted?: boolean;
}
