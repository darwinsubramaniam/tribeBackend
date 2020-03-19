import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { QueryComment } from './dto/comment.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Get('/top_posts/')
    async getTopPosts() {
        return this.postsService.getTopPost().then(result => {
            setTimeout(() => console.clear(), 3000);
            return result;
        });
    }

    @Get('/comments')
    @ApiOperation({})
    async getComments(@Query() query: QueryComment) {
        return this.postsService.getComments(query);
    }
}
