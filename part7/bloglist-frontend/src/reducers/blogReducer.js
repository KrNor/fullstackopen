import { createSlice } from "@reduxjs/toolkit";
import BlogService from "../services/blogs";
import axios from "axios";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setBlogs, appendBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await BlogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createNewBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await BlogService.create(content);
    appendBlog(newBlog);
  };
};

export default blogSlice.reducer;
