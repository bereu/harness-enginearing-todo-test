import { Injectable } from '@nestjs/common';

export interface StatusDataSourceModel {
  id: string;
  label: string;
  slug: string;
}

const BUILT_IN_STATUSES: StatusDataSourceModel[] = [
  { id: '00000000-0000-0000-0000-000000000001', label: 'To Do', slug: 'todo' },
  {
    id: '00000000-0000-0000-0000-000000000002',
    label: 'In Progress',
    slug: 'in-progress',
  },
  { id: '00000000-0000-0000-0000-000000000003', label: 'Done', slug: 'done' },
];

@Injectable()
export class StatusDataSource {
  private statuses: StatusDataSourceModel[] = [...BUILT_IN_STATUSES];

  save(status: StatusDataSourceModel): void {
    const index = this.statuses.findIndex((s) => s.id === status.id);
    if (index >= 0) {
      this.statuses[index] = status;
    } else {
      this.statuses.push(status);
    }
  }

  findAll(): StatusDataSourceModel[] {
    return [...this.statuses];
  }

  findBySlug(slug: string): StatusDataSourceModel | null {
    return this.statuses.find((s) => s.slug === slug) || null;
  }
}
