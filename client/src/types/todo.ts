export type TodoStatus = string;

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  status: TodoStatus;
  labels: Label[];
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  status?: TodoStatus;
  labelIds?: string[];
}
