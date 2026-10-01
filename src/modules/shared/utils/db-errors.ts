import { QueryFailedError } from 'typeorm';

const PG_UNIQUE_VIOLATION = '23505';

export const isUniqueViolation = (error: unknown): boolean =>
    error instanceof QueryFailedError && error.driverError?.code === PG_UNIQUE_VIOLATION;
