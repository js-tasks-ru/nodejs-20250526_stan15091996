import { Injectable, NotFoundException } from "@nestjs/common";
import { QueryDto, Task, TaskStatus } from "./task.model";

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

  getFilteredTasks(filterParams: QueryDto): Task[] {
    let filtredTasks: Task[] = [...this.tasks];

    if (filterParams.status) {
      filtredTasks = filtredTasks.filter((task: Task) => task.status === filterParams.status)
    }

    if (filterParams.sortBy) {
      filtredTasks = filtredTasks.sort((a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      })
    }

    if (filterParams.page || filterParams.limit) {
      if (filterParams.page && filterParams.limit) {
        const startIndex = (filterParams.page - 1) * filterParams.limit;
        filtredTasks = filtredTasks.splice(startIndex,  filterParams.limit);
      } else if (!filterParams.page && filterParams.limit) {
        return filtredTasks.slice(0, filterParams.limit + 1);
      }
    }

    return filtredTasks;
  }
}
