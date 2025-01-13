import {Module} from '@nestjs/common';
import {SentimentAnalyzeModule} from './sentiment-analyze/sentiment-analyze.module';
import {ReflexAILogger} from "./common/logger.service";
import {MongooseModule} from '@nestjs/mongoose';

const connectionString: string = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
console.log(connectionString);

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: connectionString,
                useNewUrlParser: true,
                useUnifiedTopology: true, // Ensure this is set
                dbName: process.env.MONGO_DATABASE,
            }),
        }),
        SentimentAnalyzeModule],
    providers: [ReflexAILogger],
    exports: [ReflexAILogger],
})
export class AppModule {
}
