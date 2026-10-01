import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClassConstructor } from 'class-transformer';
import { getConnectionFromArray, getPagingParameters } from '../types/pagination.helper';
import { Connection } from '../types';
import { ConnectionArgs } from '../types/connection-args';

export class BaseRelayRepository<T> extends Repository<T> {
    async getMany<TNode>(
        queryBuilder: SelectQueryBuilder<T>,
        nodeCls: ClassConstructor<TNode>,
        args: ConnectionArgs = {},
    ): Promise<Connection<TNode>> {
        const { limit, offset } = getPagingParameters(args);

        const [entities, count] = await queryBuilder.skip(offset).take(limit).getManyAndCount();

        return getConnectionFromArray(entities, nodeCls, args, count);
    }
}
