import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRelayRepository } from '../../shared/repositories/base-relay-repository';
import { ArticleCategory } from '../domain/models/article-category.model';

@Injectable()
export class ArticleCategoriesRepository extends BaseRelayRepository<ArticleCategory> {
    constructor(private dataSource: DataSource) {
        super(ArticleCategory, dataSource.createEntityManager());
    }
}
