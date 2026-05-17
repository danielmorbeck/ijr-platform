import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArticleStatus } from '../../shared/enums/article-status.enum';
import { uniqueSlug } from '../../shared/utils/slug.util';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { Article } from './article.entity';
import { ArticleFilterInput } from './dto/article-filter.input';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  private baseQuery() {
    return this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.categories', 'category')
      .orderBy('article.createdAt', 'DESC');
  }

  findAll(filter?: ArticleFilterInput): Promise<Article[]> {
    const query = this.baseQuery();
    if (filter?.status) {
      query.andWhere('article.status = :status', { status: filter.status });
    }
    return query.getMany();
  }

  findBySlug(slug: string): Promise<Article | null> {
    return this.baseQuery().where('article.slug = :slug', { slug }).getOne();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.baseQuery()
      .where('article.id = :id', { id })
      .getOne();
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
    return article;
  }

  private async resolveAuthor(authorId: string): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException(`Author with id "${authorId}" not found`);
    }
    return author;
  }

  private async resolveCategories(categoryIds: string[]): Promise<Category[]> {
    if (categoryIds.length === 0) {
      return [];
    }

    const categories = await this.categoriesRepository.find({
      where: { id: In(categoryIds) },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories were not found');
    }

    return categories;
  }

  private async generateUniqueArticleSlug(title: string): Promise<string> {
    return uniqueSlug(title, async (candidate) => {
      const existing = await this.articlesRepository.findOne({
        where: { slug: candidate },
      });
      return Boolean(existing);
    });
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const author = await this.resolveAuthor(input.authorId);
    const categories = await this.resolveCategories(input.categoryIds);
    const slug = await this.generateUniqueArticleSlug(input.title);

    const article = this.articlesRepository.create({
      title: input.title,
      content: input.content,
      slug,
      author,
      authorId: author.id,
      categories,
      status: ArticleStatus.DRAFT,
      publishedAt: null,
    });

    return this.articlesRepository.save(article);
  }

  async update(id: string, input: UpdateArticleInput): Promise<Article> {
    const article = await this.findOne(id);

    if (input.title !== undefined) {
      article.title = input.title;
      article.slug = await uniqueSlug(input.title, async (candidate) => {
        const existing = await this.articlesRepository.findOne({
          where: { slug: candidate },
        });
        return Boolean(existing && existing.id !== id);
      });
    }

    if (input.content !== undefined) {
      article.content = input.content;
    }

    if (input.status !== undefined) {
      article.status = input.status;
      if (input.status === ArticleStatus.PUBLISHED && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    if (input.categoryIds !== undefined) {
      article.categories = await this.resolveCategories(input.categoryIds);
    }

    return this.articlesRepository.save(article);
  }

  async publish(id: string): Promise<Article> {
    const article = await this.findOne(id);
    article.status = ArticleStatus.PUBLISHED;
    article.publishedAt = new Date();
    return this.articlesRepository.save(article);
  }

  async remove(id: string): Promise<boolean> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
    return true;
  }
}
