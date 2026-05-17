import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateArticleInput {
  @Field()
  @MinLength(3)
  title: string;

  @Field()
  @MinLength(10)
  content: string;

  @Field(() => ID)
  @IsUUID()
  authorId: string;

  @Field(() => [ID])
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
