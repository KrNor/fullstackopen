import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  console.log(content);
  const returnedObj = await axios.post(baseUrl, { content: content, votes: 0 });
  return returnedObj.data;
};

const upvoteAnecdote = async (content) => {
  console.log(content);
  const upvotedAnecdote = {
    content: content.content,
    id: content.id,
    votes: content.votes + 1,
  };
  console.log(upvotedAnecdote);

  const returnedObj = await axios.put(
    baseUrl + `/${content.id}`,
    upvotedAnecdote
  );
  return returnedObj.data;
};

export default { getAll, createNew, upvoteAnecdote };
