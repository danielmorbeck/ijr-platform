import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity('authors')
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @OneToMany(() => Article, (article) => article.author)
  @Field(() => [Article], { nullable: true })
  articles?: Article[];
}
