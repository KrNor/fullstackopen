import { useSelector, useDispatch } from "react-redux";
import { createAnecdote, voteforAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.newanecdote.value;
    event.target.newanecdote.value = "";
    dispatch(createAnecdote(content));
  };

  const voteAnecdote = (id) => {
    dispatch(voteforAnecdote(id));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="newanecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default App;
