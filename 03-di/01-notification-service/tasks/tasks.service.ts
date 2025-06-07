import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "notifications/notifications.service";
import { UsersService } from "users/users.service";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    const user = this.usersService.getUserById(task.assignedTo);

    if (!user) throw new NotFoundException(`Пользователь с ID ${task.assignedTo}  не найден`);

    this.tasks.push(task);

    this.notificationsService.sendEmail(user.email, 'Новая задача', task.title);

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    const user = this.usersService.getUserById(task.assignedTo);

    if (!user) throw new NotFoundException(`Пользователь с ID ${task.assignedTo}  не найден`);

    Object.assign(task, updateTaskDto);

    this.notificationsService.sendSMS(user.phone, 'Статус задачи "Сделать домашнюю работу" обновлён на "completed"');

    return task;
  }
}
