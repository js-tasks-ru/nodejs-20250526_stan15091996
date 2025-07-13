import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { TasksService } from "../tasks.service";
import { get } from "http";
import { UpdateTaskDto } from "tasks/dto/update-task.dto";

const task = {
  id: 1, 
  title: 'Bla', 
  description: 'Foo',
  isCompleted: false,
} as Task

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;
  let tasksSercive: TasksService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          synchronize: true,
          autoLoadEntities: true,
          database: ':memory:',
        }),
        TypeOrmModule.forFeature([Task]),
      ],
      providers: [
        TasksService,
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init()

    repository = moduleFixture.get(getRepositoryToken(Task))
    tasksSercive = moduleFixture.get(TasksService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await tasksSercive.create(task);
  });

  afterEach(() => {
    repository.clear();
  })

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const getedTasks = await request(app.getHttpServer())
        .get("/tasks");
      
      expect(getedTasks.status).toBe(200);
      expect(getedTasks.body).toEqual([task]);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/1");
      
      expect(getedTask.status).toBe(200);
      expect(getedTask.body).toEqual(task);
    });

    it("should return 404 if task not found", async () => {
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/4");
      
      expect(getedTask.status).toBe(404);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const testTask = {
        id: 2, 
        title: 'Bla2', 
        description: 'Foo2',
        isCompleted: false,
      }

      const createdTask = await request(app.getHttpServer())
        .post("/tasks")
        .send(testTask);
      
      const result = await tasksSercive.findOne(2);
      
      expect(createdTask.status).toEqual(201);
      expect(result).toEqual(testTask);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const updatedTask: UpdateTaskDto = {
        title: 'dssdad', 
        description: 'Foo',
        isCompleted: true,
      }
      
      await request(app.getHttpServer())
        .patch("/tasks/1")
        .send(updatedTask);
      
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/1");

      
      expect(getedTask.status).toBe(200);
      expect(getedTask.body).toEqual({
        ...updatedTask,
        id:1,
      })
    });

    it("should return 404 when updating non-existent task", async () => {
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/4");
      
      expect(getedTask.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      const deleteTask = await request(app.getHttpServer())
        .delete("/tasks/1");
      
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/1");

      expect(deleteTask.status).toEqual(200);
      expect(getedTask.status).toBe(404);
    });

    it("should return 404 when deleting non-existent task", async () => {
      const getedTask = await request(app.getHttpServer())
        .get("/tasks/4");
      
      expect(getedTask.status).toBe(404);
    });
  });
});
