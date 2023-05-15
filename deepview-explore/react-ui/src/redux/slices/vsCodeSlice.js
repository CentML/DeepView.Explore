import { createSlice } from "@reduxjs/toolkit";

function acquireApi() {
  if (typeof acquireApi.api === "undefined") {
    if (typeof acquireVsCodeApi === "function") {
      let f = window["acquireVsCodeApi"];
      let a = f();
      acquireApi.api = a;
    } else {
      acquireApi.api = null;
    }
  }

  return acquireApi.api;
}

const vsCodeSlice = createSlice({
  name: "vsCodeSlice",
  initialState: { vscodeApi: acquireApi() },
  reducers: {
    resetConnection: (state, action) => {
      state.vscodeApi = null;
    },
  },
});

export const { resetConnection } = vsCodeSlice.actions;

export default vsCodeSlice.reducer;
