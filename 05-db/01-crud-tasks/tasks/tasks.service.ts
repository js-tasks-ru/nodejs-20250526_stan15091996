import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>){}
  async create(createTaskDto: CreateTaskDto) {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;

    return await this.taskRepository.save(task);
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const currentTask = await this.taskRepository.find({where: {id}});
    
    if (!currentTask.length) {
      throw new NotFoundException('Задачи с данным id не существует');
    }

    return currentTask[0];
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const currentTask = await this.findOne(id);

    await this.taskRepository.update(id, updateTaskDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const currentTask = await this.findOne(id);

    await this.taskRepository.delete(id);
  }
}
