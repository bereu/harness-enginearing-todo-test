import { LabelResponseDto } from "@/todos/dto/label.response.dto";

export class TodoResponseDto {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  status: string;
  labels: LabelResponseDto[];

  constructor(
    id: string,
    title: string,
    description: string | null,
    completed: boolean,
    createdAt: Date,
    status: string,
    labels: LabelResponseDto[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt;
    this.status = status;
    this.labels = labels;
  }
}
