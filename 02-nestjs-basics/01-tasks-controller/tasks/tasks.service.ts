import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new HttpException(
        `Task with ID "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return task;
  }

  createTask(task: Task): Task {
    const nextId: number = this.tasks.length + 1;
    const taskToCreate = { id: nextId.toString(), ...task };

    this.tasks.push(taskToCreate);
    return this.tasks.at(-1);
  }

  updateTask(id: string, update: Task): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpException(
        `Task with ID "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.tasks[taskIndex] = { id, ...update };

    return this.getTaskById(id);
  }

  deleteTask(id: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpException(
        `Task with ID "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);

    return task;
  }
}
