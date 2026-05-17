import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { Article } from './article.entity';
import { ArticlesResolver } from './articles.resolver';
import { ArticlesService } from './articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Author, Category])],
  providers: [ArticlesService, ArticlesResolver],
  exports: [ArticlesService],
})
export class ArticlesModule {}
