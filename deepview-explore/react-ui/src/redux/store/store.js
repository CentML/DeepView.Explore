import {configureStore} from "@reduxjs/toolkit";
import trainingScheduleReducer from "../slices/trainingScheduleSlice";

export default configureStore({
    reducer:{
        trainingScheduleReducer
    }
})