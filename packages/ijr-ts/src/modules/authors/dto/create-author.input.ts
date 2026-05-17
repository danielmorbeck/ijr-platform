import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateAuthorInput {
  @Field()
  @MinLength(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}
