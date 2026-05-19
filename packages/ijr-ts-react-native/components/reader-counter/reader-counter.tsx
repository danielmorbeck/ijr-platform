import { StyleSheet, Text, View } from 'react-native';

export type ReaderCounterProps = {
  count: number | null;
  loading?: boolean;
};

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(47,149,220,0.12)',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a5f8a',
  },
});

function formatLabel(count: number | null, loading: boolean): string {
  if (loading || count == null) {
    return '…';
  }
  if (count === 1) {
    return '1 pessoa lendo agora';
  }
  return `${count} pessoas lendo agora`;
}

const READER_EMOJI = '👁️';

export function ReaderCounter({ count, loading = false }: ReaderCounterProps) {
  return (
    <View style={styles.banner} accessibilityRole="text">
      <View style={styles.banner} accessibilityRole="text">
        <Text style={styles.text}>
          {READER_EMOJI} {formatLabel(count, loading)}
        </Text>
      </View>
    </View>
  );
}
