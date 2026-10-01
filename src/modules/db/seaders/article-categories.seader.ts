import { Injectable } from '@nestjs/common';
import { slugify } from '../../shared/utils/slugify';
import { DbContext } from '../db-context';

const DEFAULT_CATEGORIES = ['Təhsil', 'Karyera', 'Elm', 'Cəmiyyət'];

@Injectable()
export class ArticleCategoriesSeeder {
    constructor(private readonly dbContext: DbContext) {}

    public async run(): Promise<void> {
        for (const name of DEFAULT_CATEGORIES) {
            const slug = slugify(name);

            const exists = await this.dbContext.articleCategories.exists({ where: { slug } });

            if (!exists) {
                await this.dbContext.articleCategories.insert({ name, slug });
            }
        }
    }
}
