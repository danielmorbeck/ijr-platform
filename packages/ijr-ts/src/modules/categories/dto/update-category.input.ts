import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(2)
  name?: string;
}
