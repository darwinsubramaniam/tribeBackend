import {
    Injectable,
    HttpService,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Comment, QueryComment } from './dto/comment.dto';
import { groupBy, Dictionary, filter } from 'lodash';
import { IPostWithCommentCount } from './interface/topPost.inteface';
import { Post } from './dto/post.dto';

@Injectable()
export class PostsService {
    private COMMENTS_ENDPOINT = 'https://jsonplaceholder.typicode.com/comments';

    private POST_BY_ID_ENDPOINT = (post_id: number) =>
        `https://jsonplaceholder.typicode.com/posts/${post_id}`;

    private ALL_POST_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

    private logger = new Logger(PostsService.name, true);

    /**
     * @CACHING --> Placeholder for temporary all post.
     */
    private allPost: Post[] = [];

    constructor(private http: HttpService) {}

    async getTopPost() {
        const comments: Comment[] = await this.getAllComments();

        /**
         * Group all the Comments inside DICTIONARY <K,V>  key-value pair
         * - KEY = postId
         * - VALUE = [Comments from the @SOURCE COMMENTS_ENDPOINT]
         */
        const groupedCommentsByPostId: Dictionary<Comment[]> = groupBy(
            comments,
            value => value.postId,
        );

        const keys = Object.keys(groupedCommentsByPostId);

        const allPostWithCommentCount: IPostWithCommentCount[] = [];

        for (const key of keys) {
            const comment = groupedCommentsByPostId[key][1];
            const total_number_of_comments =
                groupedCommentsByPostId[key].length;

            const postWithCommentCount: IPostWithCommentCount = {
                postId: comment.postId,
                post_title: await this.getPostTitle(comment.postId),
                post_body: comment.body,
                total_number_of_comments,
            };

            allPostWithCommentCount.push(postWithCommentCount);
        }

        return this.sortPostByCommentCount(allPostWithCommentCount).then(
            response => {
                // Delete all the cached POST
                this.allPost = [];
                return response;
            },
        );
    }

    async getComments(query: QueryComment) {
        try {
            const unfilteredComments = await this.getAllComments();

            const filteredComments = unfilteredComments.filter(comment => {
                for (const key in query) {
                    if (
                        comment[key] === undefined ||
                        comment[key] != query[key]
                    )
                        return false;
                }

                return true;
            });

            return filteredComments;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    private getAllComments = async () => {
        const comments = await this.http
            .get<Comment[]>(this.COMMENTS_ENDPOINT)
            .toPromise()
            .then(response => response.data)
            .catch(err => {
                throw new HttpException(
                    'Unable to Fetch Comments',
                    HttpStatus.BAD_GATEWAY,
                );
            });
        return comments;
    };

    private sortPostByCommentCount = async (data: IPostWithCommentCount[]) =>
        data.sort(a => a.total_number_of_comments);

    private getPostTitle = async (id: number) => {
        
        /**
         * @INEFFICIENT_METHOD
         * This method would end up calling many http request so not so efficient
         */
        // const title = await this.http
        //     .get<string>(this.POST_BY_ID_ENDPOINT(id))
        //     .toPromise()
        //     .then(result => result.data)
        //     .catch(err => {
        //         this.logger.error(`${JSON.stringify(err)}`, err);
        //         return 'Fail to get title on time'
        //     })
        // return title

        /**
         * @PRODUCTION Caching mechanism @MODIFY in real production.
         *  -> this is @not the best implementation, especially with big data.
         *  -> in production Redis DB can be used to implement efficiently
         *     the Caching Mechanism.
         *      - TTL the allPost maybe for every 5 second.
         */
        if (this.allPost.length === 0) {
            this.allPost = (
                await this.http.get<Post[]>(this.ALL_POST_ENDPOINT).toPromise()
            ).data;

            console.log('running thru http');

            return this.allPost.find(post => post.id == id).title;
        } else {
            console.log('Running from Cache');
            return this.allPost.find(post => post.id == id).title;
        }
    };
}
