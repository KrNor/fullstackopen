import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    handleFilterChange(state, action) {
      console.log("ACTION: ", action);
      return action.payload;
    },
  },
});

export const { handleFilterChange } = filterSlice.actions;
export default filterSlice.reducer;
