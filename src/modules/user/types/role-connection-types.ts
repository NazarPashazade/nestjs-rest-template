import { Exclude, Expose } from 'class-transformer';
import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';

@Exclude()
export class RoleNode implements RelayNode {
    @Expose()
    id: string;

    @Expose()
    name: string;
}

export class RoleEdge extends EdgeType(RoleNode) {}

export class RoleConnection extends ConnectionType(RoleNode, RoleEdge) {}
