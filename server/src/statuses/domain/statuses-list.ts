import { Status } from '@/statuses/domain/status';

export class StatusesList {
  private constructor(private readonly list: Status[]) {
    if (!Array.isArray(list)) {
      throw new Error('StatusesList must be initialized with an array');
    }
  }

  static create(statuses: Status[]): StatusesList {
    return new StatusesList(statuses);
  }

  static empty(): StatusesList {
    return new StatusesList([]);
  }

  getAll(): Status[] {
    return [...this.list];
  }

  getCount(): number {
    return this.list.length;
  }

  isEmpty(): boolean {
    return this.list.length === 0;
  }

  findBySlug(slug: string): Status | null {
    return this.list.find((s) => s.slug() === slug) || null;
  }

  slugExists(slug: string): boolean {
    return this.list.some((s) => s.slug() === slug);
  }

  add(status: Status): StatusesList {
    return new StatusesList([...this.list, status]);
  }
}
