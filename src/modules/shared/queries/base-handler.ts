import { Inject } from '@nestjs/common';
import { DbContext } from '../../db/db-context';
import { Logger } from '../../infrastructure/logging/logger';

export abstract class BaseHandler {
    @Inject() protected readonly dbContext: DbContext;
    @Inject() protected readonly logger: Logger;
}