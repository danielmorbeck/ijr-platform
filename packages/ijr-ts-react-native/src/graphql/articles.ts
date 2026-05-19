import { gql } from '@apollo/client';

export const PUBLISHED_ARTICLES = gql`
  query PublishedArticles {
    articles(filter: { status: PUBLISHED }) {
      id
      title
      slug
      publishedAt
      author {
        name
      }
    }
  }
`;

export const ARTICLE_BY_SLUG = gql`
  query ArticleBySlug($slug: String!) {
    article(slug: $slug) {
      id
      title
      slug
      content
      publishedAt
      author {
        name
      }
      categories {
        name
        slug
      }
    }
  }
`;
