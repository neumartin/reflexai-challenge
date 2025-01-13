import {Controller, Post, Body, Inject} from '@nestjs/common';
import {TextToAnalyzeDto} from './dto/textToAnalyze.dto';
import {ClientProxy, Ctx, RmqContext} from "@nestjs/microservices";
import {Observable, tap, timeout} from "rxjs";
import {SentimentResultDto} from "./dto/sentimentResult.dto";
import {ReflexAILogger} from "../common/logger.service";
import {ApiBody, ApiResponse} from "@nestjs/swagger";

@Controller('/api/v1/sentiment-analyze')
export class SentimentAnalyzeController {
    constructor(@Inject('SENTIMENT_ANALYZE_SERVICE') private readonly clientProxy: ClientProxy,
                private readonly logger: ReflexAILogger) {
    }

    @Post()
    @ApiBody({
        description: 'Text to analyze',
        type: TextToAnalyzeDto,
        examples: {
            textToAnalyze: {
                summary: 'Text to analyze example with person_id',
                value: {
                    "person_id": "123",
                    "text": "I love this product! It's amazing.",
                }
            },
            textToAnalyzeWithoutPersonId: {
                summary: 'Text to analyze example without person_id property to anonymize the user',
                value: {
                    "text": "I love this product! It's amazing.",
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Sentiment analysis result',
        type: SentimentResultDto,
    })
    async analyze(@Body() body: TextToAnalyzeDto, @Ctx() context: RmqContext): Promise<Observable<SentimentResultDto>> {
        try {
            let startDateTime: Date = new Date();
            const result: Observable<SentimentResultDto> = this.clientProxy.send<SentimentResultDto>('sentiment_analyze', body).pipe(
                tap({
                    complete: () => {
                        this.logger.verbose('Endpoint Gateway analyzeSentiment completed and takes ' + (new Date().getTime() - startDateTime.getTime()) + ' ms');
                    },
                    error: (err) => {
                        this.logger.error('Error in analyzeSentiment: ' + err.messages);
                    }
                }),
                timeout(10_000),
            );

            return result
        } catch (err) {
            this.logger.error('Error in analyzeSentiment: ' + err.messages);
            throw err;
        }
    }
}