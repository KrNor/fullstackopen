import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const result = useQuery(GET_ALL_AUTHORS);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
  });

  if (result.loading) {
    return <div>Authors loading...</div>;
  }
  const authors = result.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();

    await editAuthor({
      variables: {
        name,
        setBornTo: parseInt(born),
      },
    });

    setBorn("");
  };
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
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            <label>
              name:
              <select
                defaultValue=""
                name="name"
                onChange={({ target }) => setName(target.value)}
              >
                <option value="">{"pick an author"}</option>
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            born:
            <input
              value={born}
              type="number"
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">set birthyear</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
