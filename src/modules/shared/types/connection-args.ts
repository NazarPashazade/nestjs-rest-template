import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ConnectionArgs {
    @Expose()
    @ApiPropertyOptional({ example: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page?: number;

    @Expose()
    @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    readonly pageSize?: number;
}
