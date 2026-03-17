import type { Todo, CreateTodoPayload, TodoStatus } from '@/types/todo';

const API_BASE_URL = 'http://localhost:3000';

interface UpdateTodoPayload {
  title?: string;
  description?: string | null;
  completed?: boolean;
  status?: TodoStatus;
}

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const todos = await response.json() as Array<
      Omit<Todo, 'createdAt'> & { createdAt: string }
    >;
    return todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  },

  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as {
        message?: string;
      };
      throw new Error(error.message || 'Failed to create todo');
    }

    const todo = await response.json() as Omit<Todo, 'createdAt'> & {
      createdAt: string;
    };
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  },

  async getTodoById(id: string): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    const todo = await response.json() as Omit<Todo, 'createdAt'> & {
      createdAt: string;
    };
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  },

  async updateTodo(id: string, payload: UpdateTodoPayload): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as {
        message?: string;
      };
      throw new Error(error.message || 'Failed to update todo');
    }

    const todo = await response.json() as Omit<Todo, 'createdAt'> & {
      createdAt: string;
    };
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
    };
  },

  async getTodosByStatus(status: TodoStatus): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos?status=${status}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos by status');
    }
    const todos = await response.json() as Array<
      Omit<Todo, 'createdAt'> & { createdAt: string }
    >;
    return todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  },
};
