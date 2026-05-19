import { Pressable, StyleSheet, Text, View } from 'react-native';

export type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.7,
    color: '#333',
    marginBottom: 16,
  },
  cta: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2f95dc',
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export function EmptyState({
  title,
  message,
  icon,
  ctaLabel,
  onCtaPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {ctaLabel && onCtaPress ? (
        <Pressable
          onPress={onCtaPress}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          accessibilityRole="button"
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
