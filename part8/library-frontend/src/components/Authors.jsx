import { gql, useQuery } from "@apollo/client";

const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      bookCount
      born
    }
  }
`;

const Authors = (props) => {
  const result = useQuery(GET_ALL_AUTHORS);
  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Authors loading...</div>;
  }
  const authors = result.data.allAuthors;
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
