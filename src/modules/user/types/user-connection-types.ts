import { Exclude, Expose } from 'class-transformer';
import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';

@Exclude()
export class UserNode implements RelayNode {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    emailVerified: boolean;

    @Expose()
    createdAt: Date;
}

export class UserEdge extends EdgeType(UserNode) {}

export class UserConnection extends ConnectionType(UserNode, UserEdge) {}
