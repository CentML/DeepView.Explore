import { createSlice } from "@reduxjs/toolkit";
import { profiling_data } from "../../data/mock_data";

const verifyHabitatData = (data) => {
  if (
    data.habitat.predictions &&
    (data.habitat.predictions.length === 0 ||
      (data.habitat.predictions[0][0] === "unavailable" &&
        data.habitat.predictions[0][1] === -1.0))
  ) {
    data.habitat.predictions = [...profiling_data.habitat["predictions"]];
    data.habitat.isDemo = true;
  }
};

const analysisStateSlice = createSlice({
  name: "analysisStateSlice",
  initialState: {
    analysisState: null,
  },
  reducers: {
    updateDeepviewState: (state, action) => {
      /**
       * Redux state management is immutable and can only be change by using reducers
       * JSON parse and JSON stringify helps make a deep copy and avoid pointing to the same
       * memory address as event.data in App.js
       */
      if (!action.payload) {
        state.analysisState = null;
        return;
      }
      const deepview_profiler_data = JSON.parse(JSON.stringify(action.payload));
      verifyHabitatData(deepview_profiler_data);
      state.analysisState = deepview_profiler_data;
    },
  },
});

export const { updateDeepviewState } = analysisStateSlice.actions;

export default analysisStateSlice.reducer;
