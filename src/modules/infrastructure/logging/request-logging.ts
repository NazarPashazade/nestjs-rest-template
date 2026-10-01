import { LoggerService } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

const CONTEXT = 'HTTP';

// A Fastify hook rather than a Nest interceptor, so requests rejected by guards and unknown routes are logged too.
export function registerRequestLogging(app: NestFastifyApplication, logger: LoggerService): void {
    app.getHttpAdapter()
        .getInstance()
        .addHook('onResponse', async (request, reply) => {
            const { statusCode } = reply;
            const message = `${request.method} ${request.url} ${statusCode} - ${Math.round(reply.elapsedTime)}ms`;

            if (statusCode >= 500) {
                logger.error(message, undefined, CONTEXT);
            } else if (statusCode >= 400) {
                logger.warn(message, CONTEXT);
            } else {
                logger.log(message, CONTEXT);
            }
        });
}
