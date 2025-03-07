import { createSlice } from "@reduxjs/toolkit";
import UsersService from "../services/users";

const usersSlice = createSlice({
  name: "users",
  initialState: {},
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await UsersService.getAll();
    dispatch(setUsers(users));
  };
};

export default usersSlice.reducer;
