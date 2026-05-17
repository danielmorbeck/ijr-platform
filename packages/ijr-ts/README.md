# ijr-ts

NestJS GraphQL API for the IJR platform (SQLite + TypeORM).

## Run

```bash
pnpm install
pnpm run start:dev
```

- **HTTP GraphQL:** `http://localhost:3000/graphql`
- **WebSocket (subscriptions):** `ws://localhost:3000/graphql`

Use Apollo Sandbox at the HTTP URL; enable the subscription connection (graphql-ws) for live reader counts.

## Real-time article reader count

Replace `ARTICLE_UUID` with an existing article `id` from `articles { id }`.

**Tab 1 — subscription (WebSocket):**

```graphql
subscription {
  articleReaderCount(articleId: "ARTICLE_UUID")
}
```

**Tab 2 — join session:**

```graphql
mutation {
  joinArticleSession(articleId: "ARTICLE_UUID")
}
```

Returns a `sessionId` string. Each join increments the count on subscribers for that article.

**Leave session:**

```graphql
mutation {
  leaveArticleSession(articleId: "ARTICLE_UUID", sessionId: "SESSION_ID_FROM_JOIN")
}
```

Invalid `articleId` returns a GraphQL error (`Article … not found`).

## Limitations

- Reader counts are **in-memory only** (not persisted; reset on server restart).
- Abrupt disconnect without `leaveArticleSession` is cleaned up via WebSocket `onDisconnect` only when `joinArticleSession` ran on the **same** WS connection (so `connectionId` was recorded). HTTP-only joins rely on the client calling `leaveArticleSession` (e.g. React Native `useEffect` cleanup in Bloco 2).
