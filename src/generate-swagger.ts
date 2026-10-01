import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { createSwaggerDocument } from './swagger';

const OUTPUT_FILE = resolve(__dirname, '..', 'swagger', 'openapi.json');

async function generate() {
    // Preview mode builds the module graph without instantiating providers, so no database is needed.
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        preview: true,
        logger: false,
    });

    const document = createSwaggerDocument(app);

    mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
    writeFileSync(OUTPUT_FILE, JSON.stringify(document, null, 2) + '\n');

    await app.close();
    console.log(`OpenAPI document written to ${OUTPUT_FILE}`);
}

generate();
