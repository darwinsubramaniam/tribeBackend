/**
 * Expected data to recievied thru this API.
 */
export interface IPostWithCommentCount {
    postId: number;
    post_title: string;
    post_body: string;
    total_number_of_comments: number;
}
