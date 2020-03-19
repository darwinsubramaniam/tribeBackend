import { IsNumber } from 'class-validator';

/** 
 * DTO -> Data Transfer Object  
 */

export class Post {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    title: string;

    @IsNumber()
    body: string;
}
