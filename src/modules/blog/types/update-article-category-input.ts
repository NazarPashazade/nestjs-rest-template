import { PartialType } from '@nestjs/swagger';
import { CreateArticleCategoryInput } from './create-article-category-input';

export class UpdateArticleCategoryInput extends PartialType(CreateArticleCategoryInput) {}
