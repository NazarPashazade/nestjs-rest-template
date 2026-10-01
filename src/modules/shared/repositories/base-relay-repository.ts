import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClassConstructor } from 'class-transformer';
import { getConnectionFromArray } from '../types/pagination.helper';
import { Connection } from '../types';

export class BaseRelayRepository<T> extends Repository<T> {
    async getMany<TNode>(
        queryBuilder: SelectQueryBuilder<T>,
        nodeCls: ClassConstructor<TNode>,
    ): Promise<Connection<TNode>> {
        const [entities, count] = await queryBuilder.getManyAndCount();

        return getConnectionFromArray(entities, nodeCls, { pageSize: count }, count);
    }
}
