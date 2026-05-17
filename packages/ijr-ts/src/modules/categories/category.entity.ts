import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity('categories')
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  slug: string;

  @ManyToMany(() => Article, (article) => article.categories)
  @Field(() => [Article], { nullable: true })
  articles?: Article[];

  @Field(() => Int)
  articleCount?: number;
}
