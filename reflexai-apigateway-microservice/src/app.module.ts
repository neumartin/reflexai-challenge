import {Module} from '@nestjs/common';
import { SentimentAnalyzeModule } from './sentiment-analyze/sentiment-analyze.module';
import {ReflexAILogger} from "./common/logger.service";

@Module({
    imports: [SentimentAnalyzeModule],
    providers:  [ReflexAILogger],
    exports: [ReflexAILogger],
})
export class AppModule {
}
