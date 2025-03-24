import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_ALL_BOOKS, GET_ALL_GENRES } from "../queries";

const Books = () => {
  const [currentGenre, setCurrentGenre] = useState("all");

  const genreQuerry = useQuery(GET_ALL_GENRES);
  const bookQuerry = useQuery(GET_ALL_BOOKS);

  if (bookQuerry.loading) {
    return <div>Books are loading...</div>;
  }
  if (genreQuerry.loading) {
    return <div>Genres are loading...</div>;
  }

  const books = bookQuerry.data.allBooks;
  console.log(books);
  const sortedBooks =
    currentGenre === "all"
      ? books
      : books.filter((book) => {
          return book.genres.includes(currentGenre);
        });

  const genres = genreQuerry.data.allGenres;
  console.log(sortedBooks);

  const changeGenre = (props) => {
    console.log("this is the current genre:", props);
    setCurrentGenre(props);
  };

  return (
    <div>
      <h2>books</h2>

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
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => changeGenre(genre)}>
            {genre}
          </button>
        ))}
        <button key={"all"} onClick={() => changeGenre("all")}>
          All genres
        </button>
      </div>
    </div>
  );
};

export default Books;
