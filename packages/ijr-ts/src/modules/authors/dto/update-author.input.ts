import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateAuthorInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(2)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}
