export class SentimentResultDto {
    person_id: string;
    text: string;
    score?: number;
    magnitude?: number;
}