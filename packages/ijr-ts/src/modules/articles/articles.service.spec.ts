import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleStatus } from '../../shared/enums/article-status.enum';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articlesRepository: jest.Mocked<Partial<Repository<Article>>>;
  let authorsRepository: jest.Mocked<Partial<Repository<Author>>>;
  let categoriesRepository: jest.Mocked<Partial<Repository<Category>>>;

  const mockAuthor = {
    id: 'author-1',
    name: 'Ana Silva',
    email: 'ana@ijr.dev',
  } as Author;

  const mockCategories = [
    { id: 'cat-1', name: 'Tecnologia' },
    { id: 'cat-2', name: 'Política' },
  ] as Category[];

  beforeEach(async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    };

    articlesRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    authorsRepository = {
      findOne: jest.fn(),
    };

    categoriesRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: articlesRepository,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: authorsRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoriesRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('create', () => {
    it('creates article with author, categories, DRAFT status and generated slug', async () => {
      jest.mocked(authorsRepository.findOne).mockResolvedValue(mockAuthor);
      jest.mocked(categoriesRepository.find).mockResolvedValue(mockCategories);

      const savedArticle = {
        id: 'article-1',
        title: 'Introdução ao GraphQL',
        content: 'Conteúdo com mais de 10 caracteres.',
        slug: 'introducao-ao-graphql',
        author: mockAuthor,
        authorId: mockAuthor.id,
        categories: mockCategories,
        status: ArticleStatus.DRAFT,
        publishedAt: null,
      } as Article;

      jest.mocked(articlesRepository.create).mockReturnValue(savedArticle);
      jest.mocked(articlesRepository.save).mockResolvedValue(savedArticle);

      const result = await service.create({
        title: 'Introdução ao GraphQL',
        content: 'Conteúdo com mais de 10 caracteres.',
        authorId: mockAuthor.id,
        categoryIds: ['cat-1', 'cat-2'],
      });

      expect(authorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockAuthor.id },
      });
      expect(categoriesRepository.find).toHaveBeenCalled();
      expect(articlesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Introdução ao GraphQL',
          authorId: mockAuthor.id,
          status: ArticleStatus.DRAFT,
          slug: 'introducao-ao-graphql',
        }),
      );
      expect(articlesRepository.save).toHaveBeenCalled();
      expect(result.authorId).toBe(mockAuthor.id);
      expect(result.categories).toHaveLength(2);
      expect(result.status).toBe(ArticleStatus.DRAFT);
      expect(result.slug).toBe('introducao-ao-graphql');
    });
  });

  describe('findAll', () => {
    it('filters by PUBLISHED status', async () => {
      const publishedArticles = [
        { id: '1', status: ArticleStatus.PUBLISHED },
        { id: '2', status: ArticleStatus.PUBLISHED },
      ] as Article[];

      const qb = articlesRepository.createQueryBuilder!();
      (qb.getMany as jest.Mock).mockResolvedValue(publishedArticles);

      const result = await service.findAll({ status: ArticleStatus.PUBLISHED });

      expect(jest.mocked(qb.andWhere)).toHaveBeenCalledWith(
        'article.status = :status',
        {
          status: ArticleStatus.PUBLISHED,
        },
      );
      expect(result).toEqual(publishedArticles);
      expect(result.every((a) => a.status === ArticleStatus.PUBLISHED)).toBe(
        true,
      );
    });
  });
});
