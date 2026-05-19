import { gql } from '@apollo/client';

export const CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      slug
      articleCount
    }
  }
`;
