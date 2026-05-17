import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../../shared/pubsub.module';
import { ArticleReaderSessionsService } from './article-reader-sessions.service';

interface ArticleReaderCountPayload {
  articleReaderCount: number;
  articleId: string;
}

interface GqlContext {
  connectionId?: string;
  extra?: { connectionId?: string };
}

@Resolver()
export class ArticleReaderSessionsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly readerSessions: ArticleReaderSessionsService,
  ) {}

  @Mutation(() => String)
  joinArticleSession(
    @Args('articleId', { type: () => ID }) articleId: string,
    @Context() context: GqlContext,
  ): Promise<string> {
    const connectionId =
      context.connectionId ?? context.extra?.connectionId;
    return this.readerSessions.join(articleId, connectionId);
  }

  @Mutation(() => Boolean)
  leaveArticleSession(
    @Args('articleId', { type: () => ID }) articleId: string,
    @Args('sessionId') sessionId: string,
  ): Promise<boolean> {
    return this.readerSessions.leave(articleId, sessionId);
  }

  @Subscription(() => Int, {
    resolve: (payload: ArticleReaderCountPayload) =>
      payload.articleReaderCount,
    filter: (
      payload: ArticleReaderCountPayload,
      variables: { articleId: string },
    ) => payload.articleId === variables.articleId,
  })
  articleReaderCount(@Args('articleId', { type: () => ID }) articleId: string) {
    return this.pubSub.asyncIterableIterator(
      `articleReaderCount.${articleId}`,
    );
  }
}
