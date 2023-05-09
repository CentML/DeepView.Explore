import { createSlice } from "@reduxjs/toolkit";

const analysisStateSlice = createSlice({
    name: 'analysisStateSlice',
    initialState: null,
    reducers:{
        updateDeepviewState: (state, action) => {
            state = action.payload;
        }
    }
})

export const {updateDeepviewState} = analysisStateSlice.actions;

export default analysisStateSlice.reducer;