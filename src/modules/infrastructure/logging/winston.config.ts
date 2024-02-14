import * as winston from 'winston';
import { cyanBright, Format, green, magentaBright, red, yellow } from 'cli-color';
import { isObject } from '@nestjs/common/utils/shared.utils';

export const winstonConfig = {
    format: winston.format.combine(
        winston.format.timestamp({ format: 'MM/DD/YYYY, HH:mm:ss' }),
        winston.format.ms(),
        winston.format.printf(({ timestamp, level, message, ms, context }) => {
            const color = (lvl: string): Format => {
                const colorMap = {
                    error: red,
                    warn: yellow,
                    info: green,
                    verbose: cyanBright,
                    debug: magentaBright,
                };

                return colorMap[lvl];
            };
            const contextMessage = context ? yellow(`[${context}] `) : '';
            const levelMessage = color(level)(`[${level}] ${process.pid}   -`);
            const messageText = isObject(message)
                ? `\n${JSON.stringify(message, null, 2)}`
                : color(level)(message);
            return `${levelMessage} ${timestamp}  ${contextMessage}${messageText} ${yellow(ms)}`;
        }),
    ),
    transports: [
        new winston.transports.Console({
            level: 'silly',
            handleExceptions: true,
        }),
    ],
}
