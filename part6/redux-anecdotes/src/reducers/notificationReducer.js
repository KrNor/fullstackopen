import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "Welcome to the application!",
  reducers: {
    handleNotification(state, action) {
      //   console.log(state);
      //   console.log(action);
      return `${action.payload}`;
    },
    handleNotificationClear() {
      //   console.log(state);
      //   console.log(action);
      return "";
    },
  },
});

export const { handleNotification, handleNotificationClear } =
  notificationSlice.actions;

export const setNotification = (message, timeToShow) => {
  return async (dispatch) => {
    dispatch(handleNotification(message));

    setTimeout(function () {
      // console.log("aafter");
      dispatch(handleNotificationClear(""));
    }, timeToShow * 1000);
    // const newAnecdote = await anecdoteService.upvoteAnecdote(content);
    // dispatch(voteforAnecdote(newAnecdote));
  };
};

export default notificationSlice.reducer;
