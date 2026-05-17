import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Article } from './modules/articles/article.entity';
import { ArticlesService } from './modules/articles/articles.service';
import { Author } from './modules/authors/author.entity';
import { AuthorsService } from './modules/authors/authors.service';
import { Category } from './modules/categories/category.entity';
import { CategoriesService } from './modules/categories/categories.service';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  const articlesRepository = app.get<Repository<Article>>(
    getRepositoryToken(Article),
  );
  const categoriesRepository = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const authorsRepository = app.get<Repository<Author>>(
    getRepositoryToken(Author),
  );

  const authorsService = app.get(AuthorsService);
  const categoriesService = app.get(CategoriesService);
  const articlesService = app.get(ArticlesService);

  await articlesRepository.clear();
  await categoriesRepository.clear();
  await authorsRepository.clear();

  const ana = await authorsService.create({
    name: 'Ana Silva',
    email: 'ana@ijr.dev',
  });
  const bruno = await authorsService.create({
    name: 'Bruno Costa',
    email: 'bruno@ijr.dev',
  });

  const tecnologia = await categoriesService.create({ name: 'Tecnologia' });
  const politica = await categoriesService.create({ name: 'Política' });
  const esportes = await categoriesService.create({ name: 'Esportes' });
  const cultura = await categoriesService.create({ name: 'Cultura' });

  const articleDefs = [
    {
      title: 'Introdução ao GraphQL',
      author: ana,
      categories: [tecnologia],
    },
    {
      title: 'Eleições 2026: panorama',
      author: bruno,
      categories: [politica],
    },
    {
      title: 'Final da Champions',
      author: bruno,
      categories: [esportes],
    },
    {
      title: 'Exposição de arte contemporânea',
      author: ana,
      categories: [cultura],
    },
    {
      title: 'React Native com Expo Router',
      author: ana,
      categories: [tecnologia],
    },
    {
      title: 'Economia e mercados no Brasil',
      author: bruno,
      categories: [politica, tecnologia],
    },
  ];

  const slugs: string[] = [];

  for (const def of articleDefs) {
    const draft = await articlesService.create({
      title: def.title,
      content: `Conteúdo de exemplo para "${def.title}". Texto com mais de dez caracteres.`,
      authorId: def.author.id,
      categoryIds: def.categories.map((c) => c.id),
    });
    const published = await articlesService.publish(draft.id);
    slugs.push(published.slug);
  }

  console.log('Seeded 2 authors, 4 categories, 6 published articles');
  console.log('Article slugs (for article(slug: ...)):');
  for (const slug of slugs) {
    console.log(`  - ${slug}`);
  }

  await app.close();
}

seed().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
