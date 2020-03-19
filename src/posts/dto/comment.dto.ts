import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO -> Data Transfer Object. 
 */
export class Comment {
    @IsNumber()
    id: number;

    @IsNumber()
    postId: number;

    @IsNumber()
    name: string;

    @IsNumber()
    email: string;

    @IsNumber()
    body: string;
}

/**
 *  Query possible of the comment. 
 */
export class QueryComment {
    @ApiProperty({ required: false })
    @IsNumber()
    id?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    postId?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    name?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    email?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    body?: string;
}
