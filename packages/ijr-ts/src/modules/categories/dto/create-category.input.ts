import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @MinLength(2)
  name: string;
}
