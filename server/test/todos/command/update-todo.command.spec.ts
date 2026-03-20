import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTodoCommand } from '@/todos/command/update-todo.command';
import { TodoRepository } from '@/todos/repository/todo.repository';
import { Todo } from '@/todos/domain/todo';

describe('UpdateTodoCommand', () => {
  let command: UpdateTodoCommand;
  let repository: TodoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTodoCommand,
        {
          provide: TodoRepository,
          useValue: {
            getById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<UpdateTodoCommand>(UpdateTodoCommand);
    repository = module.get<TodoRepository>(TodoRepository);
  });

  describe('execute', () => {
    const originalTodo = Todo.reconstruct(
      '1',
      'Original Title',
      'Original Description',
      false,
      new Date(),
      'todo',
    );

    it('should update title', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);
      jest.spyOn(repository, 'update').mockReturnValue(undefined);

      // Act
      const result = command.execute('1', 'Updated Title');

      // Assert
      expect(result?.title().value()).toBe('Updated Title');
      expect(result?.description()).toBe('Original Description');
      expect(repository.update).toHaveBeenCalledWith(result);
    });

    it('should update description', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);
      jest.spyOn(repository, 'update').mockReturnValue(undefined);

      // Act
      const result = command.execute('1', undefined, 'Updated Description');

      // Assert
      expect(result?.title().value()).toBe('Original Title');
      expect(result?.description()).toBe('Updated Description');
      expect(repository.update).toHaveBeenCalledWith(result);
    });

    it('should update status', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);
      jest.spyOn(repository, 'update').mockReturnValue(undefined);

      // Act
      const result = command.execute(
        '1',
        undefined,
        undefined,
        undefined,
        'done',
      );

      // Assert
      expect(result?.status()).toBe('done');
      expect(result?.title().value()).toBe('Original Title');
      expect(repository.update).toHaveBeenCalledWith(result);
    });

    it('should update completed flag', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);
      jest.spyOn(repository, 'update').mockReturnValue(undefined);

      // Act
      const result = command.execute('1', undefined, undefined, true);

      // Assert
      expect(result?.completed()).toBe(true);
      expect(repository.update).toHaveBeenCalledWith(result);
    });

    it('should return null when todo not found', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(null);

      // Act
      const result = command.execute('non-existent', 'New Title');

      // Assert
      expect(result).toBeNull();
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw error when empty status is provided', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);

      // Act & Assert
      expect(() => {
        command.execute('1', undefined, undefined, undefined, '');
      }).toThrow();
    });

    it('should preserve immutability of original todo', () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockReturnValue(originalTodo);
      jest.spyOn(repository, 'update').mockReturnValue(undefined);

      // Act
      const updated = command.execute('1', 'New Title');

      // Assert
      expect(originalTodo.title().value()).toBe('Original Title');
      expect(updated?.title().value()).toBe('New Title');
      expect(originalTodo).not.toBe(updated);
    });
  });
});
