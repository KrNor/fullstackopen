import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

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
    appendAnecdote(state, action) {
      // console.log(action.payload);
      // const newAnecdot = asObject(action.payload);
      // console.log(current(state));
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { voteforAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

// anecdoteService.getAll().then((notes) => store.dispatch(setAnecdotes(notes)));

export default anecdoteSlice.reducer;
