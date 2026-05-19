import { gql } from '@apollo/client';

export const JOIN_ARTICLE_SESSION = gql`
  mutation JoinArticleSession($articleId: ID!) {
    joinArticleSession(articleId: $articleId)
  }
`;

export const LEAVE_ARTICLE_SESSION = gql`
  mutation LeaveArticleSession($articleId: ID!, $sessionId: String!) {
    leaveArticleSession(articleId: $articleId, sessionId: $sessionId)
  }
`;

export const ARTICLE_READER_COUNT = gql`
  subscription ArticleReaderCount($articleId: ID!) {
    articleReaderCount(articleId: $articleId)
  }
`;
