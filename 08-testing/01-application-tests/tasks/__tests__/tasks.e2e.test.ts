import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;
  const task = {
    title: "Task 3",
    description: "Task 3 description",
  };
  let tasks: Task[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            autoLoadEntities: true,
            entities: [Task],
          }),
        }),
        TypeOrmModule.forFeature([Task]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    repository = app.get<Repository<Task>>(getRepositoryToken(Task));
    await repository.clear();

    tasks = await repository.save([
      {
        title: "Task 1",
        description: "Task 1 description",
        isCompleted: false,
      },
      { title: "Task 2", description: "Task 2 description", isCompleted: true },
    ]);
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app.getHttpServer())
        .get("/tasks")
        .expect(200);

      expect(response.body).toEqual(tasks);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${tasks[0].id}`)
        .expect(200);

      expect(response.body).toEqual(tasks[0]);
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app.getHttpServer())
        .get("/tasks/999")
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: "Task with ID 999 not found",
        error: "Not Found",
      });
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app.getHttpServer())
        .post("/tasks")
        .send(task)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        isCompleted: false,
        ...task,
      });

      const result = await repository.findOneBy({ id: response.body.id });
      expect(result).toBeDefined();
      expect(result.title).toEqual(task.title);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const updatedTask = {
        title: "Updated Task",
        description: "Updated Task description",
        isCompleted: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${tasks[0].id}`)
        .send(updatedTask)
        .expect(200);

      expect(response.body).toEqual({
        id: tasks[0].id,
        ...updatedTask,
      });

      const result = await repository.findOneBy({ id: tasks[0].id });
      expect(result).toEqual({
        id: tasks[0].id,
        ...updatedTask,
      });
    });

    it("should return 404 when updating non-existent task", async () => {
      const updatedTask = {
        title: "Updated Task",
        description: "Updated Task description",
        isCompleted: true,
      };

      const response = await request(app.getHttpServer())
        .patch("/tasks/999")
        .send(updatedTask)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: "Task with ID 999 not found",
        error: "Not Found",
      });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${tasks[0].id}`)
        .expect(200);

      expect(response.body).toEqual({
        title: tasks[0].title,
        description: tasks[0].description,
        isCompleted: tasks[0].isCompleted,
      });

      const result = await repository.findOneBy({ id: tasks[0].id });
      expect(result).toBeNull();
    });

    it("should return 404 when deleting non-existent task", async () => {
      const response = await request(app.getHttpServer())
        .delete("/tasks/999")
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: "Task with ID 999 not found",
        error: "Not Found",
      });
    });
  });
});
