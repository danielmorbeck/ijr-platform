import { useQuery } from '@apollo/client/react';
import { Stack, router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import QueryState from '@/components/QueryState';
import { Text, View } from '@/components/Themed';
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
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum artigo publicado</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/article/[slug]',
                  params: { slug: item.slug },
                })
              }
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.author.name} · {formatDate(item.publishedAt)}
              </Text>
            </Pressable>
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 14,
    opacity: 0.65,
  },
  headerLink: {
    marginRight: 16,
  },
  headerLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
