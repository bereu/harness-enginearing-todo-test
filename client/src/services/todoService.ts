import type { Todo, CreateTodoPayload, TodoStatus } from "@/types/todo";
import { httpClient } from "@/services/httpClient";

interface UpdateTodoPayload {
  title?: string;
  description?: string | null;
  completed?: boolean;
  status?: TodoStatus;
}

interface TodoResponse extends Omit<Todo, "createdAt"> {
  createdAt: string;
}

const transformTodoResponse = (todo: TodoResponse): Todo => ({
  ...todo,
  createdAt: new Date(todo.createdAt),
});

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await httpClient.get<TodoResponse[]>("/todos");
    return response.data.map(transformTodoResponse);
  },

  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await httpClient.post<TodoResponse>("/todos", payload);
    return transformTodoResponse(response.data);
  },

  async getTodoById(id: string): Promise<Todo> {
    const response = await httpClient.get<TodoResponse>(`/todos/${id}`);
    return transformTodoResponse(response.data);
  },

  async updateTodo(id: string, payload: UpdateTodoPayload): Promise<Todo> {
    const response = await httpClient.patch<TodoResponse>(`/todos/${id}`, payload);
    return transformTodoResponse(response.data);
  },

  async getTodosByStatus(status: TodoStatus): Promise<Todo[]> {
    const response = await httpClient.get<TodoResponse[]>("/todos", {
      params: { status },
    });
    return response.data.map(transformTodoResponse);
  },
};
