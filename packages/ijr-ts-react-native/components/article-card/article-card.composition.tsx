import { ArticleCard } from './article-card';

export const Default = () => (
  <ArticleCard
    title="Como estruturar um monorepo com pnpm"
    authorName="Maria Silva"
    publishedAt="19 mai. 2026"
  />
);

export const WithCategory = () => (
  <ArticleCard
    title="GraphQL no React Native"
    authorName="João Santos"
    publishedAt="15 mai. 2026"
    category={{ name: 'Tecnologia', color: '#2f95dc' }}
    onPress={() => {}}
  />
);

export const Pressable = () => (
  <ArticleCard
    title="Artigo clicável"
    authorName="Ana Costa"
    publishedAt="10 mai. 2026"
    onPress={() => {}}
  />
);
