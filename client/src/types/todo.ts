export type TodoStatus = 'todo' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  status: TodoStatus;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  status?: TodoStatus;
}
