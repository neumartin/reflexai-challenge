import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class TextToAnalyzeDto {
    @ApiProperty({ description: 'Person ID' })
    person_id: string;

    @ApiProperty({ description: 'Text to analyze' })
    @IsNotEmpty()
    text: string;
}