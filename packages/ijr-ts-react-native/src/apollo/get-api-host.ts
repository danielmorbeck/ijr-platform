import Constants from 'expo-constants';

const API_PORT = 3000;
const GRAPHQL_PATH = '/graphql';

function hostFromHostUri(hostUri: string | undefined): string | undefined {
  if (!hostUri) return undefined;
  const host = hostUri.split(':')[0];
  return host || undefined;
}

function getDevLanHost(): string | undefined {
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    return hostFromHostUri(debuggerHost);
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostFromHostUri(hostUri);
  }

  return undefined;
}

function getApiHost(): string {
  return (
    getDevLanHost() ??
    process.env.EXPO_PUBLIC_GRAPHQL_HOST ??
    'localhost'
  );
}

export function getGraphqlHttpUri(): string {
  return `http://${getApiHost()}:${API_PORT}${GRAPHQL_PATH}`;
}

export function getGraphqlWsUri(): string {
  return `ws://${getApiHost()}:${API_PORT}${GRAPHQL_PATH}`;
}
