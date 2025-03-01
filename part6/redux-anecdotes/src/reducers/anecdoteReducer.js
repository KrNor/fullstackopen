import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteforAnecdote(state, action) {
      const newishAnecdote = action.payload;
      const newMap = state.map((anecdote) => {
        return anecdote.id === newishAnecdote.id ? newishAnecdote : anecdote;
      });
      return newMap;
    },
    appendAnecdote(state, action) {
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

export const upvoteAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.upvoteAnecdote(content);
    dispatch(voteforAnecdote(newAnecdote));
  };
};

export default anecdoteSlice.reducer;
