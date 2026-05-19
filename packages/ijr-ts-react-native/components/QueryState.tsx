import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type QueryStateProps = {
  loading: boolean;
  error?: Error;
  onRetry?: () => void;
  children: ReactNode;
};

export default function QueryState({
  loading,
  error,
  onRetry,
  children,
}: QueryStateProps) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Algo deu errado</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        {onRetry ? (
          <Pressable
            style={[styles.retryButton, { borderColor: tint }]}
            onPress={onRetry}>
            <Text style={[styles.retryLabel, { color: tint }]}>Tentar novamente</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
  },
  retryButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
