import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { ArticleReaderSessionsService } from './modules/articles/article-reader-sessions.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PubSubModule } from './shared/pubsub.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data.sqlite'),
      autoLoadEntities: true,
      // synchronize is for local development only — use migrations in production
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    PubSubModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ArticlesModule],
      inject: [ArticleReaderSessionsService],
      useFactory: (readerSessions: ArticleReaderSessionsService) => ({
        autoSchemaFile: join(__dirname, '..', 'schema.gql'),
        sortSchema: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context) => {
              const connectionId = randomUUID();
              (context.extra as { connectionId?: string }).connectionId =
                connectionId;
              return { connectionId };
            },
            onDisconnect: (context) => {
              const connectionId = (
                context.extra as { connectionId?: string }
              ).connectionId;
              if (connectionId) {
                readerSessions.removeByConnectionId(connectionId);
              }
            },
          },
        },
      }),
    }),
    AuthorsModule,
    CategoriesModule,
    ArticlesModule,
  ],
})
export class AppModule {}
