import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';

export class UserNode implements RelayNode {
    id: string;
    name: string;
}

export class UserEdge extends EdgeType(UserNode) { }

export class UserConnection extends ConnectionType(UserNode, UserEdge) { }
