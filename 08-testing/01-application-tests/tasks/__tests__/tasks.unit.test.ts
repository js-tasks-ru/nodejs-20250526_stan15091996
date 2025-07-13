import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

  const mockTasksRepository = (): jest.Mocked<Partial<Repository<Task>>> => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  });

describe("TasksService", () => {
  let service: TasksService;
  let repository: jest.Mocked<Partial<Repository<Task>>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTasksRepository, 
        }
      ]
    }).compile();

    service = module.get(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const task = {
        id: 1, 
        title: 'Bla', 
        description: 'Foo',
        isCompleted: false,
      } as Task

      repository.save.mockResolvedValue(task);

      const result = await service.create(task);

      expect(result).toEqual(task);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const task = {
        id: 1, 
        title: 'Bla', 
        description: 'Foo',
        isCompleted: false,
      } as Task

      repository.find.mockResolvedValue([task]);

      const result = await service.findAll();

      expect(result).toEqual([task]);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const task = {
        id: 1, 
        title: 'Bla', 
        description: 'Foo',
        isCompleted: false,
      } as Task;

      repository.findOneBy.mockResolvedValue(task);

      const result = await service.findOne(1);

      expect(result).toEqual(task);
      expect(repository.findOneBy).toHaveBeenCalledWith({id: 1});
    });

    it("should throw NotFoundException when task does not exist", async () => {
      try {
        const result = await service.findOne(2);
      } catch(error) {
        expect(error instanceof NotFoundException).toBeTruthy();
      }
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const task = {
        id: 1, 
        title: 'Bla', 
        description: 'Foo',
        isCompleted: false,
      } as Task;

      const updatedTask = {
        id: 1, 
        title: 'dssdad', 
        description: 'Foo',
        isCompleted: true,
      }

      repository.findOneBy.mockResolvedValue(task);
      repository.save.mockResolvedValue(updatedTask);

      const result = await service.update(1, {title: 'dssdad', isCompleted: true});

      expect(result).toEqual(updatedTask);
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      try {
        const result = await service.update(2, {title: 'dssdad', isCompleted: true});
      } catch(error) {
        expect(error instanceof NotFoundException).toBeTruthy();
      }
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const task = {
        id: 1, 
        title: 'Bla', 
        description: 'Foo',
        isCompleted: false,
      } as Task;

      repository.findOneBy.mockResolvedValue(task);
      repository.remove.mockResolvedValue(task);

      const result = await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(task);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      try {
        const result = await service.remove(2);
      } catch(error) {
        expect(error instanceof NotFoundException).toBeTruthy();
      }
    });
  });
});
