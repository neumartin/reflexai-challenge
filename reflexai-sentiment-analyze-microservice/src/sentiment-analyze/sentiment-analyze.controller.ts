import {Body, Controller} from '@nestjs/common';
import {SentimentAnalyzeService} from "./sentiment-analyze.service";
import {ClientProxy, MessagePattern} from "@nestjs/microservices";
import {SentimentResultDto} from "./dto/sentimentResult.dto";
import {TextToAnalyzeDto} from "./dto/textToAnalyze.dto";
import {ReflexAILogger} from "../common/logger.service";

@Controller()
export class SentimentAnalyzeController {
    constructor(private readonly sentimentAnalyzeService: SentimentAnalyzeService,
                private readonly logger: ReflexAILogger) {
    }

    @MessagePattern('sentiment_analyze')
    async analyzeSentiment(@Body() textToAnalyzeDto: TextToAnalyzeDto): Promise<SentimentResultDto> {
        try {
            return await this.sentimentAnalyzeService.analyzeSentiment(textToAnalyzeDto);
        } catch (err) {
            this.logger.error('Error in analyzeSentiment: ' + err.message);
            throw err;
        }
    }
}
