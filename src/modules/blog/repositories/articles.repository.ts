import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRelayRepository } from '../../shared/repositories/base-relay-repository';
import { Article } from '../domain/models/article.model';

@Injectable()
export class ArticlesRepository extends BaseRelayRepository<Article> {
    constructor(private dataSource: DataSource) {
        super(Article, dataSource.createEntityManager());
    }

    async incrementViewCount(id: string): Promise<void> {
        // Raw SQL because TypeORM's update builders also bump updated_at and version, and a view isn't an edit.
        await this.query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [id]);
    }
}
