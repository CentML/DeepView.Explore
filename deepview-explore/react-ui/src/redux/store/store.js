import { configureStore } from "@reduxjs/toolkit";
import trainingScheduleReducer from "../slices/trainingScheduleSlice";
import vsCodeSliceReducer from "../slices/vsCodeSlice";
import analysisStateSliceReducer from "../slices/analysisStateSlice";

export default configureStore({
  reducer: {
    trainingScheduleReducer,
    vsCodeSliceReducer,
    analysisStateSliceReducer,
  },
});
