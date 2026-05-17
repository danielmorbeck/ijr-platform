import { registerEnumType } from '@nestjs/graphql';

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(ArticleStatus, {
  name: 'ArticleStatus',
  description: 'Publication status of an article',
});
