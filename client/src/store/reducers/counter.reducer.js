const initialState = {
  count: 0,
};

const reducer = (state = initialState, action) => {
  if (action.type === "INC") {
    return {
      ...state,
      count: state.count + 1,
    };
  }

  if (action.type === "DEC") {
    return {
      ...state,
      count: state.count - 1,
    };
  }

  return { ...state };
};

export default reducer;
