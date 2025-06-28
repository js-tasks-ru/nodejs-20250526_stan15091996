import { BadRequestException, Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { QueryDto, Task, TaskStatus } from "./task.model";
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  getTasks(
    @Query() queryParams?: QueryDto,
    @Query("status") status?: TaskStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sortBy") sortBy?: keyof Task,
  ) {
    if (page && page < 1) {
      throw new BadRequestException('Page must be positiv');
    }

    if (limit && limit < 1) {
      throw new BadRequestException('Limit must be positiv');
    }

    const filterParams: QueryDto = {}

    if (status) filterParams.status = status;
    if (page) filterParams.page = page;
    if (limit) filterParams.limit = limit;
    if (sortBy) filterParams.sortBy = sortBy;

    return this.tasksService.getFilteredTasks(filterParams);
  }
}
