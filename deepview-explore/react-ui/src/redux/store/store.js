import { configureStore } from "@reduxjs/toolkit";
import trainingScheduleReducer from "../slices/trainingScheduleSlice";
import vsCodeSliceReducer from "../slices/vsCodeSlice";
import analysisStateSliceReducer from "../slices/analysisStateSlice";
import passesStateReducer from '../slices/passesStateSlice';
/**
 * Redux store:
 * Handles analysisStateSliceReducer - analysis state (all the information coming from deepview profile)
 * Handles trainingScheduleReducer   - training schedule (epochs and iterations per epoch)
 * Handles vsCodeSliceReducer        - vsCode connection (webview)
 * Handles passesStateReducer        - keeps track if ddp pass was selected
 */
export default configureStore({
  reducer: {
    analysisStateSliceReducer,
    trainingScheduleReducer,
    vsCodeSliceReducer,
    passesStateReducer,
  },
});
