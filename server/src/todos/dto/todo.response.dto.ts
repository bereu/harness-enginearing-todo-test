export class TodoResponseDto {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  status: string;

  constructor(
    id: string,
    title: string,
    description: string | null,
    completed: boolean,
    createdAt: Date,
    status: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt;
    this.status = status;
  }
}
