import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../../shared/pubsub.module';
import { ArticlesService } from './articles.service';

interface SessionMeta {
  articleId: string;
  connectionId?: string;
}

@Injectable()
export class ArticleReaderSessionsService {
  private readonly sessionsByArticle = new Map<string, Set<string>>();
  private readonly sessionMeta = new Map<string, SessionMeta>();
  private readonly sessionsByConnection = new Map<string, Set<string>>();

  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly articlesService: ArticlesService,
  ) {}

  async join(articleId: string, connectionId?: string): Promise<string> {
    await this.articlesService.findOne(articleId);

    const sessionId = randomUUID();

    let articleSessions = this.sessionsByArticle.get(articleId);
    if (!articleSessions) {
      articleSessions = new Set();
      this.sessionsByArticle.set(articleId, articleSessions);
    }
    articleSessions.add(sessionId);

    this.sessionMeta.set(sessionId, { articleId, connectionId });

    if (connectionId) {
      let connectionSessions = this.sessionsByConnection.get(connectionId);
      if (!connectionSessions) {
        connectionSessions = new Set();
        this.sessionsByConnection.set(connectionId, connectionSessions);
      }
      connectionSessions.add(sessionId);
    }

    await this.publishCount(articleId);
    return sessionId;
  }

  async leave(articleId: string, sessionId: string): Promise<boolean> {
    const meta = this.sessionMeta.get(sessionId);
    if (!meta || meta.articleId !== articleId) {
      return true;
    }

    this.removeSession(sessionId, articleId, meta.connectionId);
    await this.publishCount(articleId);
    return true;
  }

  removeByConnectionId(connectionId: string): void {
    const sessionIds = this.sessionsByConnection.get(connectionId);
    if (!sessionIds) {
      return;
    }

    const affectedArticleIds = new Set<string>();

    for (const sessionId of sessionIds) {
      const meta = this.sessionMeta.get(sessionId);
      if (!meta) {
        continue;
      }
      this.removeSession(sessionId, meta.articleId, connectionId);
      affectedArticleIds.add(meta.articleId);
    }

    this.sessionsByConnection.delete(connectionId);

    for (const articleId of affectedArticleIds) {
      void this.publishCount(articleId);
    }
  }

  getCount(articleId: string): number {
    return this.sessionsByArticle.get(articleId)?.size ?? 0;
  }

  async emitCurrentCount(articleId: string): Promise<void> {
    await this.publishCount(articleId);
  }

  private removeSession(
    sessionId: string,
    articleId: string,
    connectionId?: string,
  ): void {
    const articleSessions = this.sessionsByArticle.get(articleId);
    articleSessions?.delete(sessionId);
    if (articleSessions?.size === 0) {
      this.sessionsByArticle.delete(articleId);
    }

    this.sessionMeta.delete(sessionId);

    if (connectionId) {
      const connectionSessions = this.sessionsByConnection.get(connectionId);
      connectionSessions?.delete(sessionId);
      if (connectionSessions?.size === 0) {
        this.sessionsByConnection.delete(connectionId);
      }
    }
  }

  private async publishCount(articleId: string): Promise<void> {
    await this.pubSub.publish(`articleReaderCount.${articleId}`, {
      articleReaderCount: this.getCount(articleId),
      articleId,
    });
  }
}
