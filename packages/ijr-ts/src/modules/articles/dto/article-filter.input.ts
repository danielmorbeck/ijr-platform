import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { ArticleStatus } from '../../../shared/enums/article-status.enum';

@InputType()
export class ArticleFilterInput {
  @Field(() => ArticleStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}
