import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getFilteredTasks(status?: TaskStatus, page?: number, limit?: number): Task[] {
    let tasks = this.tasks;

    console.log(Object.values(TaskStatus));

    if (status && !Object.values(TaskStatus).includes(status)) {
      throw new HttpException(`Wrong status parameter`, HttpStatus.BAD_REQUEST);
    }

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (page < 0 || limit < 0) {
      throw new HttpException(
        `Wrong pagination parameters`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      tasks = tasks.slice(start, end);
    }
    return tasks;
  }
}
