import { useQuery } from '@apollo/client/react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import QueryState from '@/components/QueryState';
import { Text, View } from '@/components/Themed';
import { CATEGORIES } from '@/src/graphql/categories';

type Category = {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
};

function articleCountLabel(count: number) {
  return count === 1 ? '1 artigo' : `${count} artigos`;
}

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();
  const gap = 12;
  const padding = 16;
  const cardWidth = (width - padding * 2 - gap) / 2;

  const { data, loading, error, refetch, networkStatus } = useQuery<{
    categories: Category[];
  }>(CATEGORIES);

  const refreshing = networkStatus === 4;

  return (
    <QueryState loading={loading} error={error} onRetry={() => refetch()}>
      <FlatList
        data={data?.categories ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refetch()} />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCount}>
              {articleCountLabel(item.articleCount)}
            </Text>
          </View>
        )}
      />
    </QueryState>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    minHeight: 100,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 14,
    opacity: 0.65,
  },
});
