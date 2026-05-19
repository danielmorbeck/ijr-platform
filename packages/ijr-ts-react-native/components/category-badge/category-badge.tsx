import { StyleSheet, Text, View } from 'react-native';

export type CategoryBadgeProps = {
  name: string;
  color: string;
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.25)',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}
