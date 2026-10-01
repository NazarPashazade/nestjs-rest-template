import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ArticleCategoryDTO {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;
}
