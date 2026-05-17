import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { ArticleFilterInput } from './dto/article-filter.input';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';

@Resolver(() => Article)
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Query(() => [Article], { name: 'articles' })
  articles(
    @Args('filter', { nullable: true }) filter?: ArticleFilterInput,
  ): Promise<Article[]> {
    return this.articlesService.findAll(filter);
  }

  @Query(() => Article, { name: 'article', nullable: true })
  article(@Args('slug') slug: string): Promise<Article | null> {
    return this.articlesService.findBySlug(slug);
  }

  @Mutation(() => Article)
  createArticle(@Args('input') input: CreateArticleInput): Promise<Article> {
    return this.articlesService.create(input);
  }

  @Mutation(() => Article)
  updateArticle(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateArticleInput,
  ): Promise<Article> {
    return this.articlesService.update(id, input);
  }

  @Mutation(() => Article)
  publishArticle(@Args('id', { type: () => ID }) id: string): Promise<Article> {
    return this.articlesService.publish(id);
  }

  @Mutation(() => Boolean)
  deleteArticle(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.articlesService.remove(id);
  }
}
