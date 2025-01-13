import {Module} from '@nestjs/common';
import {SentimentAnalyzeController} from './sentiment-analyze.controller';
import {SentimentAnalyzeService} from './sentiment-analyze.service';
import {ReflexAILogger} from "../common/logger.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Sentiment, SentimentSchema} from "./schemas/sentimen.schema";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Sentiment.name, schema: SentimentSchema}]),
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
    providers: [SentimentAnalyzeService, ReflexAILogger]
})
export class SentimentAnalyzeModule {
}
