import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SentimentDocument = HydratedDocument<Sentiment>;

@Schema({autoCreate: true, collection: 'sentiments'})
export class Sentiment {
    @Prop({ required: true, index: true })
    person_id: string;

    @Prop({ required: true })
    text: string;

    @Prop()
    score: number;

    @Prop()
    magnitude: number;
}

export const SentimentSchema = SchemaFactory.createForClass(Sentiment);
