import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

describe("TasksService", () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    // Сбрасываем все вызовы и реализации моков после каждого теста
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "Test task",
        description: "Test task description",
      };
      const newTask = { id: 1, ...createTaskDto };

      mockTasksRepository.create.mockReturnValue(newTask);
      mockTasksRepository.save.mockReturnValue(newTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(newTask);
      expect(mockTasksRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockTasksRepository.save).toHaveBeenCalledWith(newTask);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      mockTasksRepository.find.mockReturnValue([{ title: "Test task" }]);

      const result = await service.findAll();
      expect(result).toEqual([{ title: "Test task" }]);
      expect(mockTasksRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const taskId = 1;
      mockTasksRepository.findOneBy.mockReturnValue([{ title: "Test task" }]);

      const result = await service.findOne(taskId);
      expect(result).toEqual([{ title: "Test task" }]);
      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
    });

    it("should throw NotFoundException when task does not exist", async () => {
      const taskId = 1;
      mockTasksRepository.findOneBy.mockReturnValue(null);

      await expect(service.findOne(taskId)).rejects.toThrow(NotFoundException);
      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: "Updated task",
        isCompleted: true,
      };
      const existingTask = { id: taskId, title: "Old task" };

      mockTasksRepository.findOneBy.mockReturnValue(existingTask);
      mockTasksRepository.save.mockReturnValue({
        ...existingTask,
        ...updateTaskDto,
      });

      const result = await service.update(taskId, updateTaskDto);

      expect(result).toEqual({ ...existingTask, ...updateTaskDto });
      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
      expect(mockTasksRepository.save).toHaveBeenCalledWith({
        ...existingTask,
        ...updateTaskDto,
      });
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: "Updated task",
        isCompleted: true,
      };

      mockTasksRepository.findOneBy.mockReturnValue(null);

      await expect(service.update(taskId, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const taskId = 1;
      const existingTask = { id: taskId, title: "Test task" };

      mockTasksRepository.findOneBy.mockReturnValue(existingTask);
      mockTasksRepository.remove.mockReturnValue(existingTask);

      await service.remove(taskId);

      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
      expect(mockTasksRepository.remove).toHaveBeenCalledWith(existingTask);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      const taskId = 1;

      mockTasksRepository.findOneBy.mockReturnValue(null);

      await expect(service.remove(taskId)).rejects.toThrow(NotFoundException);
      expect(mockTasksRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
    });
  });
});
