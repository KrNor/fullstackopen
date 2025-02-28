import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "Welcome to the application!",
  reducers: {
    handleVoteNotification(state, action) {
      //   console.log(state);
      //   console.log(action);
      return `You upvoted the anecdote: "${action.payload.content}"`;
    },
    handleCreationNotification(state, action) {
      //   console.log(state);
      //   console.log(action);
      return `A new anecdote was created!- "${action.payload}"`;
    },
    handleNotificationClear() {
      //   console.log(state);
      //   console.log(action);
      return "";
    },
    // handleNotificationChange(state, action) {
    //   console.log("ACTION: ", action);
    //   return action.payload;
    // },
  },
});

export const {
  handleVoteNotification,
  handleCreationNotification,
  handleNotificationClear,
} = notificationSlice.actions;
export default notificationSlice.reducer;
