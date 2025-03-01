/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { upvoteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch();
  const voteAnecdote = async (anecdote) => {
    dispatch(upvoteAnecdote(anecdote));
    dispatch(setNotification(`you voted for :"${anecdote.content}"!`, 5));
  };
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => voteAnecdote(anecdote)}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    if (state.filter.length >= 1) {
      return state.anecdotes.filter((anecdote) => {
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
