export class StatusResponseDto {
  id: string;
  label: string;
  slug: string;

  constructor(id: string, label: string, slug: string) {
    this.id = id;
    this.label = label;
    this.slug = slug;
  }
}
