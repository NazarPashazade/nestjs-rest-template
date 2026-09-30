import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface Edge<T> {
    node: T;
}

export function EdgeType<T>(classRef: Type<T>): new () => Edge<T> {
    abstract class EdgeClass implements Edge<T> {
        @ApiProperty({ type: classRef })
        node: T;
    }

    return EdgeClass as any;
}
