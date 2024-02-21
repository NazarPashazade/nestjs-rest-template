import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';

export class RoleNode implements RelayNode {
    id: string;
    name: string;
}

export class RoleEdge extends EdgeType(RoleNode) { }

export class RoleConnection extends ConnectionType(RoleNode, RoleEdge) { }
