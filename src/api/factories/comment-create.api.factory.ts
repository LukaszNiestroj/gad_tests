import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { expect } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

export async function prepareAndCreateCommentWithApi(
  commentsRequest: CommentsRequest,
  articleId: number,
): Promise<APIResponse> {
  const commentData = prepareCommentPayload(articleId);
  return await createCommentWithApi(commentsRequest, commentData);
}

export async function createCommentWithApi(
  commentsRequest: CommentsRequest,
  commentData: CommentPayload,
): Promise<APIResponse> {
  const responseComment = await commentsRequest.post(commentData);

  // Assert comment exist
  const commentJson = await responseComment.json();

  const expectedStatusCode = 200;
  await expect(async () => {
    const responseCommentCreated = await commentsRequest.getOne(commentJson.id);
    expect(
      responseCommentCreated.status(),
      `Expect status ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return responseComment;
}
