import { createSlice, current } from "@reduxjs/toolkit";
// const anecdotesAtStart = [
//   "If it hurts, do it more often",
//   "Adding manpower to a late software project makes it later!",
//   "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//   "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
//   "Premature optimization is the root of all evil.",
//   "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
// ];

// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0,
//   };
// };

// const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteforAnecdote(state, action) {
      const id = action.payload;
      // console.log(action.payload);
      // console.log(current(state));
      const AnecdoteToUpvote = state.find((n) => {
        // console.log(current(n));
        return n.id === id;
      });
      // console.log(AnecdoteToUpvote);
      const newAnecdote = {
        ...AnecdoteToUpvote,
        votes: AnecdoteToUpvote.votes + 1,
      };
      // console.log(state);
      const newMap = state.map((anecdote) => {
        return anecdote.id === id ? newAnecdote : anecdote;
      });
      return newMap;
    },
    createAnecdote(state, action) {
      // console.log(action.payload);
      console.log(current(state));
      console.log(action);
      // const newAnecdot = asObject(action.payload);
      // console.log(current(state));
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { voteforAnecdote, createAnecdote, setAnecdotes } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;
