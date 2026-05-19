import { View, StyleSheet } from 'react-native';
import { CategoryBadge } from './category-badge';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
});

export const Default = () => (
  <CategoryBadge name="Tecnologia" color="#2f95dc" />
);

export const Multiple = () => (
  <View style={styles.row}>
    <CategoryBadge name="Tecnologia" color="#2f95dc" />
    <CategoryBadge name="Negócios" color="#e67e22" />
    <CategoryBadge name="Cultura" color="#9b59b6" />
  </View>
);
