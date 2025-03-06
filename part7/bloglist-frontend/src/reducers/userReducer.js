import { createSlice } from "@reduxjs/toolkit";
import LoginService from "../services/login";
import BlogService from "../services/blogs";
import { setNotification } from "./notificationReducer";
import _ from "lodash";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser(state, action) {
      //   console.log(action.payload);
      if (_.isEmpty(action.payload)) {
        return {};
      }
      return action.payload;
    },
    getUser(state, action) {
      return state.user;
    },
  },
});

export const { setUser, getUser } = userSlice.actions;

export const initializeUser = () => {
  return async (dispatch) => {
    // const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    // console.log(state.user);
    // dispatch(setUser(state.user));
    const user = await dispatch(getUser());
    if (_.isEmpty(user)) {
      return {};
    }

    BlogService.setToken(user.token);

    // console.log("this is the user");
    // console.log(user);
    return user.payload;
  };
};

export const loginUser = (content) => {
  return async (dispatch) => {
    try {
      const user = await LoginService.login({ ...content });
      dispatch(setUser(user));
      //   console.log("this is the user");
      //   console.log(user);
      BlogService.setToken(user.token);
      dispatch(setNotification("Welcome to the application!"));
    } catch (error) {
      dispatch(setNotification("something went wrong with the logging in."));
      setUser(null);
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(setUser({}));
  };
};

export default userSlice.reducer;
