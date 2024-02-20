import { Type } from '@nestjs/common';

export interface Edge<T> {
    node: T;
}

export function EdgeType<T>(classRef: Type<T>): new () => Edge<T> {
    abstract class EdgeClass implements Edge<T> {
        node: T;
    }

    return EdgeClass as any;
}
