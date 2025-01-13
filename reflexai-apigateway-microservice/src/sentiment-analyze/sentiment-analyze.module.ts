import {Module} from '@nestjs/common';
import {SentimentAnalyzeController} from './sentiment-analyze.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ReflexAILogger} from "../common/logger.service";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'SENTIMENT_ANALYZE_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`],
                    queue: process.env.ANALYZE_SERVICE_QUEUE,
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [SentimentAnalyzeController],
    providers: [ReflexAILogger],
})
export class SentimentAnalyzeModule {}
