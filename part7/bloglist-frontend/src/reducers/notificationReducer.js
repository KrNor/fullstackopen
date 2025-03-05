import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    handleNotification(state, action) {
      return `${action.payload}`;
    },
    handleNotificationClear() {
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
      dispatch(handleNotificationClear(""));
    }, 5000);
  };
};

export default notificationSlice.reducer;
