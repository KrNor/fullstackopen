import { gql } from "@apollo/client";

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      bookCount
      born
    }
  }
`;
export const GET_ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
      id
    }
  }
`;
