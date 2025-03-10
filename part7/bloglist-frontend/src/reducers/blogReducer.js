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
    updateBlog(state, action) {
      const blogToUpdate = action.payload;
      const newState = state.map((blog) => {
        return blog.id === blogToUpdate.id ? blogToUpdate : blog;
      });
      return newState;
      // need to find the blog in the state, and replace it with the updated blog that is given in action.payload
    },
  },
});

export const { setBlogs, appendBlog, updateBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await BlogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createNewBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await BlogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (content) => {
  return async (dispatch) => {
    const updatedBlog = await BlogService.likeBlog(content);
    // console.log(updatedBlog);
    dispatch(updateBlog(updatedBlog));
  };
};

export default blogSlice.reducer;
