import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type ArticleCardCategory = {
  name: string;
  color: string;
};

export type ArticleCardProps = {
  title: string;
  authorName: string;
  publishedAt: string;
  category?: ArticleCardCategory;
  onPress?: () => void;
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111',
  },
  meta: {
    fontSize: 14,
    opacity: 0.65,
    color: '#333',
  },
  categoryRow: {
    marginTop: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export function ArticleCard({
  title,
  authorName,
  publishedAt,
  category,
  onPress,
}: ArticleCardProps) {
  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {authorName} · {publishedAt}
      </Text>
      {category ? (
        <View style={styles.categoryRow}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}
