import {Inject, Injectable} from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';
import {SentimentResultDto} from "./dto/sentimentResult.dto";
import {TextToAnalyzeDto} from "./dto/textToAnalyze.dto";
import {ReflexAILogger} from "../common/logger.service";
import {google} from "@google-cloud/language/build/protos/protos";
import ISentiment = google.cloud.language.v2.ISentiment;
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import Sentiment = google.cloud.language.v1.Sentiment;

@Injectable()
export class SentimentAnalyzeService {
    private client = new LanguageServiceClient();

    constructor(private  readonly logger: ReflexAILogger,
                @InjectModel(Sentiment.name) private sentimentModel: Model<Sentiment>) {
        this.client = new LanguageServiceClient();
    }

    async analyzeSentiment(textToAnalyzeDto: TextToAnalyzeDto): Promise<SentimentResultDto> {
        let startDateTime: Date = new Date();

        const document = {
            content: textToAnalyzeDto.text,
            type: 'PLAIN_TEXT' as const,
        };

        try {
            // Realizar el análisis de sentimiento
            const [result]  = await this.client.analyzeSentiment({ document });
            const sentiment: ISentiment = result.documentSentiment;

            if (!textToAnalyzeDto.person_id || textToAnalyzeDto.person_id === '')
                textToAnalyzeDto.person_id = 'anonymous';

            let resultSentiment: SentimentResultDto = {
                person_id: textToAnalyzeDto.person_id,
                text: textToAnalyzeDto.text,
                score: sentiment.score,
                magnitude: sentiment.magnitude,
            }

            try {
                const createdSentiment = new this.sentimentModel(resultSentiment);
                await createdSentiment.save();
                this.logger.verbose('analyzeSentiment saved to MongoDB');
            } catch (err) {
                this.logger.error('Error in analyzeSentiment when saving to MongoDB: ' + err.message);
            }

            this.logger.verbose('analyzeSentiment called and takes ' + (new Date().getTime() - startDateTime.getTime()) + ' ms');
            return resultSentiment
        } catch (err) {
            this.logger.error('Error in analyzeSentiment: ' + err.message);
        }
    }
}
