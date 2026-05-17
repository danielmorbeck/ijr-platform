import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'categories' })
  categories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  category(@Args('slug') slug: string): Promise<Category> {
    return this.categoriesService.findBySlug(slug);
  }

  @Mutation(() => Category)
  createCategory(@Args('input') input: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(input);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteCategory(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.categoriesService.remove(id);
  }
}
