import { useQuery } from '@apollo/client/react';
import { ArticleCard } from '@danielmorbeck/ijr-ui.article-card';
import { EmptyState } from '@danielmorbeck/ijr-ui.empty-state';
import { Stack, router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import QueryState from '@/components/QueryState';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { PUBLISHED_ARTICLES } from '@/src/graphql/articles';

type PublishedArticle = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  author: { name: string };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ArticlesScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  const { data, loading, error, refetch, networkStatus } = useQuery<{
    articles: PublishedArticle[];
  }>(PUBLISHED_ARTICLES);

  const refreshing = networkStatus === 4;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Articles',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/categories')}
              style={({ pressed }) => [styles.headerLink, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.headerLinkText, { color: tint }]}>Categorias</Text>
            </Pressable>
          ),
        }}
      />
      <QueryState loading={loading} error={error} onRetry={() => refetch()}>
        <FlatList
          data={data?.articles ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            (data?.articles?.length ?? 0) === 0 ? styles.emptyList : styles.list
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => refetch()} />}
          ListEmptyComponent={
            <EmptyState title="Nenhum artigo publicado" />
          }
          renderItem={({ item }) => (
            <ArticleCard
              title={item.title}
              authorName={item.author.name}
              publishedAt={formatDate(item.publishedAt)}
              onPress={() =>
                router.push({
                  pathname: '/article/[slug]',
                  params: { slug: item.slug },
                })
              }
            />
          )}
        />
      </QueryState>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  headerLink: {
    marginRight: 16,
  },
  headerLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
