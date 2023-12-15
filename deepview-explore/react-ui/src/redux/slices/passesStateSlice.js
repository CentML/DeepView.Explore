import { createSlice } from "@reduxjs/toolkit";

const DDP_INITIAL_STATE = true;

const passesStateSlice = createSlice({
  name: "passesStateSlice",
  initialState: {
    ddpPass: DDP_INITIAL_STATE,
  },
  reducers: {
    updatePassState: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

export const { updatePassState } = passesStateSlice.actions;

export default passesStateSlice.reducer;
