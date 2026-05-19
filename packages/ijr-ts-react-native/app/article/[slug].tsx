import { useQuery } from '@apollo/client/react';
import { CategoryBadge } from '@danielmorbeck/ijr-ui.category-badge';
import { EmptyState } from '@danielmorbeck/ijr-ui.empty-state';
import { ReaderCounter } from '@danielmorbeck/ijr-ui.reader-counter';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import QueryState from '@/components/QueryState';
import { Text } from '@/components/Themed';
import { ARTICLE_BY_SLUG } from '@/src/graphql/articles';
import { useArticleReaderSession } from '@/src/hooks/useArticleReaderSession';
import { categoryColor } from '@/src/utils/categoryColor';

type ArticleDetail = {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string;
  author: { name: string };
  categories: { name: string; slug: string }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const slugParam = typeof slug === 'string' ? slug : (slug?.[0] ?? '');

  const { data, loading, error, refetch } = useQuery<{
    article: ArticleDetail | null;
  }>(ARTICLE_BY_SLUG, {
    variables: { slug: slugParam },
    skip: !slugParam,
  });

  const article = data?.article;
  const { readerCount, joining } = useArticleReaderSession(article?.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: article?.title ?? (slugParam || 'Artigo'),
        }}
      />
      <QueryState loading={loading} error={error} onRetry={() => refetch()}>
        {!article ? (
          <EmptyState title="Artigo não encontrado" />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <ReaderCounter count={readerCount ?? null} loading={joining} />

            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.meta}>
              {article.author.name} · {formatDate(article.publishedAt)}
            </Text>

            {article.categories.length > 0 ? (
              <View style={styles.chips}>
                {article.categories.map((category) => (
                  <CategoryBadge
                    key={category.slug}
                    name={category.name}
                    color={categoryColor(category.slug)}
                  />
                ))}
              </View>
            ) : null}

            <Text style={styles.content}>{article.content}</Text>
          </ScrollView>
        )}
      </QueryState>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 30,
  },
  meta: {
    fontSize: 14,
    opacity: 0.65,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
