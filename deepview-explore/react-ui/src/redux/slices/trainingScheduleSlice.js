import { createSlice } from "@reduxjs/toolkit";

const INITIAL_EPOCHS = 50;
const INITIAL_ITER_PER_EPOCH = 2000;


export const trainingScheduleSlice = createSlice({
  name: "trainingScheduleSlice",
  initialState: {
    epochs: INITIAL_EPOCHS,
    iterPerEpoch: INITIAL_ITER_PER_EPOCH
  },
  reducers: {
    setIterationsValues: (state, action) => {
      const {epochs,iterPerEpoch } = action.payload;
      state.epochs = epochs;
      state.iterPerEpoch = iterPerEpoch;
    },
  },
});

export const {setIterationsValues} = trainingScheduleSlice.actions;

export default trainingScheduleSlice.reducer;