// could probably change both to FILTER_CHANGE, but ill leave this for now
const filterReducer = (state = "", action) => {
  //   console.log("ACTION: ", action);
  switch (action.type) {
    case "FILTER_ACTIVE":
      return action.payload;
    case "FILTER_INACTIVE":
      return action.payload;
    default:
      return state;
  }
};

export const handleFilterChange = (searchFilter = "") => {
  if (searchFilter.length >= 1) {
    return {
      type: "FILTER_ACTIVE",
      payload: searchFilter,
    };
  } else {
    return { type: "FILTER_INACTIVE", payload: searchFilter };
  }
};
export default filterReducer;
