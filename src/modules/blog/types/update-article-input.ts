import { PartialType } from '@nestjs/swagger';
import { CreateArticleInput } from './create-article-input';

export class UpdateArticleInput extends PartialType(CreateArticleInput) {}
