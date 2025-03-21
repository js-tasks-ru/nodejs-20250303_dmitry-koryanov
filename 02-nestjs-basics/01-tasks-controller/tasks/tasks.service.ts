import { Injectable, NotFoundException } from "@nestjs/common";
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
      throw new NotFoundException(`Task with ID "${id}" not found`);
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
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasks[taskIndex] = { id, ...update };

    return this.getTaskById(id);
  }

  deleteTask(id: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);

    return task;
  }
}
