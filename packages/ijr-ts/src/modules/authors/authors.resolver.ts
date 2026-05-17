import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Author } from './author.entity';
import { AuthorsService } from './authors.service';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Query(() => [Author], { name: 'authors' })
  authors(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  author(@Args('id', { type: () => ID }) id: string): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Mutation(() => Author)
  createAuthor(@Args('input') input: CreateAuthorInput): Promise<Author> {
    return this.authorsService.create(input);
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAuthorInput,
  ): Promise<Author> {
    return this.authorsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteAuthor(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.authorsService.remove(id);
  }
}
