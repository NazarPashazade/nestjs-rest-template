import { LoggerService } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyRequest } from 'fastify';

const CONTEXT = 'HTTP';

// A Fastify hook rather than a Nest interceptor, so requests rejected by guards and unknown routes are logged too.
export function registerRequestLogging(app: NestFastifyApplication, logger: LoggerService): void {
    const errorMessages = new WeakMap<FastifyRequest, string>();
    const fastify = app.getHttpAdapter().getInstance();

    fastify.addHook('onSend', async (request, reply, payload) => {
        if (reply.statusCode >= 400 && typeof payload === 'string') {
            const message = extractErrorMessage(payload);
            if (message) {
                errorMessages.set(request, message);
            }
        }
        return payload;
    });

    fastify.addHook('onResponse', async (request, reply) => {
        const { statusCode } = reply;
        const errorMessage = errorMessages.get(request);
        const message =
            `${request.method} ${request.url} ${statusCode} - ${Math.round(reply.elapsedTime)}ms` +
            (errorMessage ? ` - ${errorMessage}` : '');

        if (statusCode >= 500) {
            logger.error(message, undefined, CONTEXT);
        } else if (statusCode >= 400) {
            logger.warn(message, CONTEXT);
        } else {
            logger.log(message, CONTEXT);
        }
    });
}

function extractErrorMessage(payload: string): string | undefined {
    try {
        const { message } = JSON.parse(payload);
        return Array.isArray(message) ? message.join('; ') : message;
    } catch {
        return undefined;
    }
}
