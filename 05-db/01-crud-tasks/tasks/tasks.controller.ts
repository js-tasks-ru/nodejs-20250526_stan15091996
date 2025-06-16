import { Controller, Get, Post, Patch, Delete, Body, Param } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id)
  }

  @Patch(":id")
  update(@Param('id') id: number, @Body() body: UpdateTaskDto) {
    console.log(1);
    return this.tasksService.update(id, body);
  }

  @Delete(":id")
  async remove(@Param('id') id: number) {
    await this.tasksService.remove(id);
    return {
      "message": "Task deleted successfully"
    }
  }
}
