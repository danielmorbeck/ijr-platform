import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleStatus } from '../../shared/enums/article-status.enum';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Entity('articles')
@ObjectType()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column({ unique: true })
  @Field()
  slug: string;

  @Column('text')
  @Field()
  content: string;

  @Column({
    type: 'simple-enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  @Field(() => ArticleStatus)
  status: ArticleStatus;

  @Column({ type: 'datetime', nullable: true })
  @Field(() => Date, { nullable: true })
  publishedAt: Date | null;

  @ManyToOne(() => Author, (author) => author.articles, { eager: false })
  @Field(() => Author)
  author: Author;

  @Column()
  authorId: string;

  @ManyToMany(() => Category, (category) => category.articles, {
    eager: false,
  })
  @JoinTable({
    name: 'article_categories',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  @Field(() => [Category])
  categories: Category[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
