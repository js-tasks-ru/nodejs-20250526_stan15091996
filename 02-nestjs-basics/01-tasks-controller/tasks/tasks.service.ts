import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./task.model";
import { timeStamp } from "console";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const taskIndex = this.getTaskIndexById(id);

    if (taskIndex < 0) throw new NotFoundException(`task with id ${id} not found`);

    return this.tasks[taskIndex];
  }

  createTask(task: Task): Task {
    const currentId: string = this.tasks[this.tasks.length - 1]?.id;
    const newTask: Task = {
      ...task,
      id: currentId ? String(Number(currentId) + 1) : String(this.tasks.length + 1),
    }

    this.tasks.push(newTask);

    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    const taskIndex = this.getTaskIndexById(id);

    if (taskIndex < 0) throw new NotFoundException(`task with id ${id} not found`);

    for (let key in update) {
      if (key !== 'id') {
        this.tasks[taskIndex][key] = update[key];
      }
    }
    
    return this.tasks[taskIndex];
  }

  deleteTask(id: string): Task {
    const taskIndex = this.getTaskIndexById(id);

    if (taskIndex < 0) throw new NotFoundException(`task with id ${id} not found`);

    return this.tasks.splice(taskIndex, 1)[0];
  }

  private getTaskIndexById(id: string): number {
    return this.tasks.findIndex((task: Task) => task.id === id);
  }
}
