import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
