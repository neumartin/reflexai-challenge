import {NestFactory} from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import {ReflexAILogger} from "./common/logger.service";
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import * as process from "node:process";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: new ReflexAILogger(),
        }
    );

    const reflexAILogger = app.get(ReflexAILogger);
    app.useLogger(reflexAILogger); // Replace the global logger

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Sentiment Analyzer API')
        .setDescription('This API analyze a text and returns the person_is, score and magnitude, see more here: https://cloud.google.com/natural-language/docs/analyzing-sentiment#language-sentiment-string-protocol')
        .setVersion('1.0')
        .addTag('sentiment-analyze')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app.useGlobalPipes(new ValidationPipe({
        disableErrorMessages: false,
        exceptionFactory: (errors) => {
            const validationErrors: string = errors.join()
            reflexAILogger.warn('Validation error:' + validationErrors);
            return new BadRequestException('Validation failed: ' + validationErrors);
        },}));
    await app.listen(3000, '0.0.0.0');
    reflexAILogger.log(`API Gateway Microservice is running on port 3000`);
}

bootstrap();