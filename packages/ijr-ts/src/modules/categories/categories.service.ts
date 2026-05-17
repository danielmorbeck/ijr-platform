import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniqueSlug } from '../../shared/utils/slug.util';
import { Category } from './category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoriesRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.articleCount', 'category.articles')
      .orderBy('category.name', 'ASC')
      .getMany();

    return categories;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.articles', 'article')
      .leftJoinAndSelect('article.author', 'author')
      .loadRelationCountAndMap('category.articleCount', 'category.articles')
      .where('category.slug = :slug', { slug })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const slug = await uniqueSlug(input.name, async (candidate) => {
      const existing = await this.categoriesRepository.findOne({
        where: { slug: candidate },
      });
      return Boolean(existing);
    });

    const category = this.categoriesRepository.create({ ...input, slug });
    return this.categoriesRepository.save(category);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (input.name) {
      category.name = input.name;
      category.slug = await uniqueSlug(input.name, async (candidate) => {
        const existing = await this.categoriesRepository.findOne({
          where: { slug: candidate },
        });
        return Boolean(existing && existing.id !== id);
      });
    }

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    await this.categoriesRepository.remove(category);
    return true;
  }
}
