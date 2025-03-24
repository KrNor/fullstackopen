/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_BOOKS_BY_GENRE, GET_ALL_GENRES } from "../queries";

const BookTable = ({ currentGenre }) => {
  const bookQuerry = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: currentGenre },
  });

  if (bookQuerry.loading) {
    return <div>Books are loading...</div>;
  }
  const books = bookQuerry.data.allBooks;
  // console.log(currentGenre);

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((a) => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Books = () => {
  const [currentGenre, setCurrentGenre] = useState("");

  const genreQuerry = useQuery(GET_ALL_GENRES);

  if (genreQuerry.loading) {
    return <div>Genres are loading...</div>;
  }

  const genres = genreQuerry.data.allGenres;

  const changeGenre = (props) => {
    setCurrentGenre(props);
  };

  return (
    <div>
      <h2>books</h2>

      <BookTable currentGenre={currentGenre} />
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => changeGenre(genre)}>
            {genre}
          </button>
        ))}
        <button key={""} onClick={() => changeGenre("")}>
          All genres
        </button>
      </div>
    </div>
  );
};

export default Books;
