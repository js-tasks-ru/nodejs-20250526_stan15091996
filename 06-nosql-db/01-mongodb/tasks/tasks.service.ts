import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";
import { waitForDebugger } from "inspector";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private TaskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.TaskModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      priority: createTaskDto.priority,
    })

    return task;
  }

  async findAll() {
    const tasks = await this.TaskModel.find();

    return tasks;
  }

  async findOne(id: ObjectId) {
    const task = await this.TaskModel.findById(id);

    if (!task) throw new NotFoundException("Задача с таким id не напйдена");

    return task;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.TaskModel.findByIdAndUpdate(id, updateTaskDto, {new: true}).exec();

    if (!updatedTask) throw new NotFoundException("Задача с таким id не напйдена");

    return updatedTask;
  }

  async remove(id: ObjectId) {
    const deletedTask = await this.TaskModel.findByIdAndDelete(id).exec()

    if (!deletedTask) throw new NotFoundException("Задача с таким id не напйдена");

    return deletedTask;
  }
}
