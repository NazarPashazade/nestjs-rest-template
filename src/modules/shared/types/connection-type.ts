import { Type } from '@nestjs/common';
import { PageInfo } from './page-info';
import { Edge } from './edge-type';

export interface Connection<T> {
    totalCount: number;

    edges: Array<Edge<T>>;

    pageInfo: PageInfo;
}

export function ConnectionType<T>(classRef: Type<T>, Edge: new () => Edge<T>): new () => Connection<T> {
    abstract class ConnectionClass implements Connection<T> {
        totalCount: number;

        edges: Array<Edge<T>>;

        pageInfo: PageInfo;
    }

    return ConnectionClass as any;
}
