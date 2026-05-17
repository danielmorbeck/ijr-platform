import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ArticleStatus } from '../../../shared/enums/article-status.enum';

@InputType()
export class UpdateArticleInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(3)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(10)
  content?: string;

  @Field(() => ArticleStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
