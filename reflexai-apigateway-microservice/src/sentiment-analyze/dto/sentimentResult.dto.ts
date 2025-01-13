import {ApiProperty} from "@nestjs/swagger";

export class SentimentResultDto {
    @ApiProperty({ description: 'Text analyzed' })
    text: string;

    @ApiProperty({ description: 'Person ID' })
    person_id: string;

    @ApiProperty({ description: 'Sentiment score' })
    score?: number;

    @ApiProperty({ description: 'Sentiment magnitude' })
    magnitude?: number;
}