import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions} from '@nestjs/microservices';
import {AppModule} from './app.module';
import * as process from "node:process";
import {ReflexAILogger} from "./common/logger.service";
import {LogLevel} from "ts-loader/dist/logger";

async function bootstrap() {
    const reflexAILogger = new ReflexAILogger();
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            logger: reflexAILogger,
            options: {
                urls: [`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`],
                queue: process.env.ANALYZE_SERVICE_QUEUE,
                queueOptions: {
                    durable: false
                },
            },
        },
    );

    //const reflexAILogger = app.get(ReflexAILogger);
    app.useLogger(reflexAILogger); // Replace the global logger
    await app.listen();
    reflexAILogger.log('Sentiment Analyze Microservice is running!');
}

bootstrap();
