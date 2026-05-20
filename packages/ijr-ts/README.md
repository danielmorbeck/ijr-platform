# ijr-ts

Documentação do monorepo: [README na raiz](../../README.md).

NestJS GraphQL API for the IJR platform (SQLite + TypeORM).

## Setup

From the monorepo root:

```bash
pnpm install
pnpm --filter ijr-ts seed
pnpm --filter ijr-ts dev
```

Or from this package directory:

```bash
pnpm install
pnpm seed
pnpm dev
```

- **HTTP GraphQL:** `http://localhost:3000/graphql`
- **WebSocket (subscriptions):** `ws://localhost:3000/graphql`

Use Apollo Sandbox at the HTTP URL; enable the subscription connection (graphql-ws) for live reader counts.

Re-running `pnpm seed` clears and recreates demo data in `data.sqlite` (gitignored).

## Queries

List all articles:

```graphql
query {
  articles {
    id
    title
    slug
    status
    author {
      name
    }
    categories {
      name
      slug
    }
  }
}
```

Published articles only:

```graphql
query {
  articles(filter: { status: PUBLISHED }) {
    id
    title
    slug
    publishedAt
  }
}
```

Single article by slug (after seed):

```graphql
query {
  article(slug: "introducao-ao-graphql") {
    id
    title
    content
    status
    author {
      name
      email
    }
    categories {
      name
      slug
    }
  }
}
```

Authors and categories:

```graphql
query {
  authors {
    id
    name
    email
  }
  categories {
    id
    name
    slug
    articleCount
  }
}
```

## Mutations

```graphql
mutation {
  createAuthor(input: { name: "Novo Autor", email: "novo@ijr.dev" }) {
    id
    name
    email
  }
}
```

```graphql
mutation {
  createCategory(input: { name: "Ciência" }) {
    id
    name
    slug
  }
}
```

```graphql
mutation {
  createArticle(
    input: {
      title: "Meu artigo"
      content: "Conteúdo com pelo menos dez caracteres."
      authorId: "AUTHOR_UUID"
      categoryIds: ["CATEGORY_UUID"]
    }
  ) {
    id
    slug
    status
  }
}
```

```graphql
mutation {
  publishArticle(id: "ARTICLE_UUID") {
    id
    status
    publishedAt
  }
}
```

Replace `AUTHOR_UUID`, `CATEGORY_UUID`, and `ARTICLE_UUID` with values from `authors`, `categories`, or `articles` queries.

## Subscriptions — real-time article reader count

Replace `ARTICLE_UUID` with an existing article `id` from `articles { id }` (or from a seeded article query).

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
  leaveArticleSession(
    articleId: "ARTICLE_UUID"
    sessionId: "SESSION_ID_FROM_JOIN"
  )
}
```

Invalid `articleId` returns a GraphQL error (`Article … not found`).

## Tests

```bash
pnpm --filter ijr-ts test
pnpm --filter ijr-ts test:e2e
```

## Limitations

- **SQLite** is for local development only; use Postgres (and migrations) in production.
- Reader counts are **in-memory only** (not persisted; reset on server restart).
- Abrupt disconnect without `leaveArticleSession` is cleaned up via WebSocket `onDisconnect` only when `joinArticleSession` ran on the **same** WS connection. HTTP-only joins rely on the client calling `leaveArticleSession`.
- For production-scale real-time counts, use Redis (or similar) instead of the in-process `PubSub` implementation.
