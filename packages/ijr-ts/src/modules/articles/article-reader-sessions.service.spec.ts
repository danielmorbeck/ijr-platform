import { Test, TestingModule } from '@nestjs/testing';
import { PUB_SUB } from '../../shared/pubsub.module';
import { ArticleReaderSessionsService } from './article-reader-sessions.service';
import { ArticlesService } from './articles.service';

describe('ArticleReaderSessionsService', () => {
  let service: ArticleReaderSessionsService;
  let pubSub: { publish: jest.Mock };
  let articlesService: { findOne: jest.Mock };

  const articleId = 'article-1';

  beforeEach(async () => {
    pubSub = { publish: jest.fn().mockResolvedValue(undefined) };
    articlesService = {
      findOne: jest.fn().mockResolvedValue({ id: articleId }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleReaderSessionsService,
        { provide: PUB_SUB, useValue: pubSub },
        { provide: ArticlesService, useValue: articlesService },
      ],
    }).compile();

    service = module.get<ArticleReaderSessionsService>(
      ArticleReaderSessionsService,
    );
  });

  describe('join', () => {
    it('increments counter and publishes articleReaderCount', async () => {
      const session1 = await service.join(articleId);

      expect(service.getCount(articleId)).toBe(1);
      expect(pubSub.publish).toHaveBeenCalledWith(
        `articleReaderCount.${articleId}`,
        { articleReaderCount: 1, articleId },
      );

      pubSub.publish.mockClear();

      const session2 = await service.join(articleId);

      expect(service.getCount(articleId)).toBe(2);
      expect(pubSub.publish).toHaveBeenCalledWith(
        `articleReaderCount.${articleId}`,
        { articleReaderCount: 2, articleId },
      );
      expect(session1).not.toBe(session2);
    });
  });

  describe('emitCurrentCount', () => {
    it('publishes the current count without changing sessions', async () => {
      await service.join(articleId);
      pubSub.publish.mockClear();

      await service.emitCurrentCount(articleId);

      expect(service.getCount(articleId)).toBe(1);
      expect(pubSub.publish).toHaveBeenCalledWith(
        `articleReaderCount.${articleId}`,
        { articleReaderCount: 1, articleId },
      );
    });
  });

  describe('leave', () => {
    it('decrements counter after valid session leaves', async () => {
      const session1 = await service.join(articleId);
      const session2 = await service.join(articleId);

      expect(service.getCount(articleId)).toBe(2);

      await service.leave(articleId, session1);
      expect(service.getCount(articleId)).toBe(1);

      await service.leave(articleId, session2);
      expect(service.getCount(articleId)).toBe(0);
    });
  });
});
