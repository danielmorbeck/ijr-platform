import { useQuery } from '@apollo/client/react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import QueryState from '@/components/QueryState';
import { Text, View } from '@/components/Themed';
import { ARTICLE_BY_SLUG } from '@/src/graphql/articles';
import { useArticleReaderSession } from '@/src/hooks/useArticleReaderSession';

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
  const slugParam = typeof slug === 'string' ? slug : slug?.[0] ?? '';

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
          <View style={styles.centered}>
            <Text style={styles.notFound}>Artigo não encontrado</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.readerBanner}>
              <Text style={styles.readerCount}>
                👁️{' '}
                {readerCount == null || joining
                  ? '…'
                  : `${readerCount} pessoas lendo agora`}
              </Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.meta}>
              {article.author.name} · {formatDate(article.publishedAt)}
            </Text>

            {article.categories.length > 0 ? (
              <View style={styles.chips}>
                {article.categories.map((category) => (
                  <View key={category.slug} style={styles.chip}>
                    <Text style={styles.chipText}>{category.name}</Text>
                  </View>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFound: {
    fontSize: 16,
    opacity: 0.7,
  },
  readerBanner: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(47,149,220,0.12)',
  },
  readerCount: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  chipText: {
    fontSize: 13,
    opacity: 0.85,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
