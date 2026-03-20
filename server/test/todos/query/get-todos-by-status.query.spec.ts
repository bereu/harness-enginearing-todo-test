import { GetTodosByStatusQuery } from '@/todos/query/get-todos-by-status.query';
import { TodoRepository } from '@/todos/repository/todo.repository';
import { Todo } from '@/todos/domain/todo';

describe('GetTodosByStatusQuery', () => {
  let query: GetTodosByStatusQuery;
  let repository: TodoRepository;

  beforeEach(() => {
    repository = {
      findByStatus: jest.fn(),
    } as unknown as TodoRepository;
    query = new GetTodosByStatusQuery(repository);
  });

  it('should return todos filtered by status', () => {
    // Arrange
    const doneTodo = Todo.create(
      'Completed task',
      'A task that is done',
      undefined,
      'done',
    );
    const mocks = [doneTodo];
    jest.spyOn(repository, 'findByStatus').mockReturnValue(mocks);

    // Act
    const result = query.execute('done');

    // Assert
    expect(repository.findByStatus).toHaveBeenCalledWith('done');
    expect(result.getAll()).toHaveLength(1);
    expect(result.getAll()[0].status()).toBe('done');
  });

  it('should return empty list when no todos match status', () => {
    // Arrange
    jest.spyOn(repository, 'findByStatus').mockReturnValue([]);

    // Act
    const result = query.execute('invalid-status');

    // Assert
    expect(repository.findByStatus).toHaveBeenCalledWith('invalid-status');
    expect(result.getAll()).toHaveLength(0);
  });

  it('should return multiple todos with matching status', () => {
    // Arrange
    const todo1 = Todo.create('Task 1', undefined, undefined, 'in-progress');
    const todo2 = Todo.create('Task 2', undefined, undefined, 'in-progress');
    const mocks = [todo1, todo2];
    jest.spyOn(repository, 'findByStatus').mockReturnValue(mocks);

    // Act
    const result = query.execute('in-progress');

    // Assert
    expect(result.getAll()).toHaveLength(2);
    expect(result.getAll().every((t) => t.status() === 'in-progress')).toBe(
      true,
    );
  });
});
