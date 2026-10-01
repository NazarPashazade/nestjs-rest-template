import { Exclude, Expose } from 'class-transformer';
import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';

@Exclude()
export class ArticleCategoryNode implements RelayNode {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;
}

export class ArticleCategoryEdge extends EdgeType(ArticleCategoryNode) {}

export class ArticleCategoryConnection extends ConnectionType(ArticleCategoryNode, ArticleCategoryEdge) {}
