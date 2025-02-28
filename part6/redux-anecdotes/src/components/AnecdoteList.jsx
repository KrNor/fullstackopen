/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { voteforAnecdote } from "../reducers/anecdoteReducer";

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch();
  // console.log(anecdote);
  const voteAnecdote = (id) => {
    dispatch(voteforAnecdote(id));
  };
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  // const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    // console.log(state);
    // console.log("here", state.filter.length);
    if (state.filter.length >= 1) {
      // console.log(state);
      return state.anecdotes.filter((anecdote) => {
        // console.log(anecdote.content.includes(state.filter));
        return anecdote.content
          .toLowerCase()
          .includes(state.filter.toLowerCase());
      });
    }
    return state.anecdotes;
  });
  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote key={anecdote.id} anecdote={anecdote} />
        ))}
    </div>
  );
};

export default AnecdoteList;
