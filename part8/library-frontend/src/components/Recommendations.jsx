import { useQuery } from "@apollo/client";
import { GET_ALL_BOOKS, GET_USER_INFO } from "../queries";

const Recommendations = () => {
  const userInfo = useQuery(GET_USER_INFO);
  const bookQuerry = useQuery(GET_ALL_BOOKS);
  if (bookQuerry.loading) {
    return <div>Books are loading...</div>;
  }
  if (userInfo.loading) {
    return <div>User information is loading...</div>;
  }

  const books = bookQuerry.data.allBooks;

  const sortedBooks = books.filter((book) => {
    return book.genres.includes(userInfo.data.me.favoriteGenre);
  });

  return (
    <div>
      <h2>Recommended books that are from your favorite genre:</h2>
      <h1>{userInfo.data.me.favoriteGenre}</h1>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {sortedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
