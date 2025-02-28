import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "Welcome to the application!",
  reducers: {
    handleNotificationChange(state, action) {
      console.log("ACTION: ", action);
      return action.payload;
    },
  },
});

export const { handleNotificationChange } = notificationSlice.actions;
export default notificationSlice.reducer;
