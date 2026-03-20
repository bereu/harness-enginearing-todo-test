import { Injectable } from "@nestjs/common";
import { Status } from "@/statuses/domain/status";
import { StatusesList } from "@/statuses/domain/statuses-list";
import { StatusDataSource } from "@/statuses/datasource/status.datasource";

@Injectable()
export class StatusRepository {
  constructor(private readonly datasource: StatusDataSource) {}

  findAll(): StatusesList {
    const models = this.datasource.findAll();
    const statuses = models.map((m) => Status.reconstruct(m.id, m.label, m.slug));
    return StatusesList.create(statuses);
  }

  save(status: Status): void {
    this.datasource.save({
      id: status.id(),
      label: status.label(),
      slug: status.slug(),
    });
  }

  findBySlug(slug: string): Status | null {
    const model = this.datasource.findBySlug(slug);
    if (!model) return null;
    return Status.reconstruct(model.id, model.label, model.slug);
  }
}
