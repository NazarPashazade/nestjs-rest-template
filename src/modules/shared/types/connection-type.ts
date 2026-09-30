import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PageInfo } from './page-info';
import { Edge } from './edge-type';

export interface Connection<T> {
    totalCount: number;

    edges: Array<Edge<T>>;

    pageInfo: PageInfo;
}

export function ConnectionType<T>(classRef: Type<T>, Edge: new () => Edge<T>): new () => Connection<T> {
    abstract class ConnectionClass implements Connection<T> {
        @ApiProperty()
        totalCount: number;

        @ApiProperty({ type: [Edge] })
        edges: Array<Edge<T>>;

        @ApiProperty({ type: PageInfo })
        pageInfo: PageInfo;
    }

    return ConnectionClass as any;
}
