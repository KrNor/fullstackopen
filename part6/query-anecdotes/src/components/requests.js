import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

export const createAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

export const upvoteAnecdote = async (upvotedAnecdote) => {
  await axios
    .put(`${baseUrl}/${upvotedAnecdote.id}`, {
      ...upvotedAnecdote,
      votes: upvotedAnecdote.votes + 1,
    })
    .then((res) => res.data);
};
