import { createSlice } from "@reduxjs/toolkit";

// https://stackoverflow.com/questions/54135313/webview-extension-in-typescript
/**
 * Returns the vscode API handle. the acquireVsCodeApi function would not be available when compiling
 * the react project, so we need to dynamically look it up. This function also caches the handle and
 * returns it if previously acquired.
 * @returns The VSCode API handle
 */
function acquireApi() {
  // if (typeof this.acquireApi.api == 'undefined') {
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
  reducers:{
    resetConnection: (state,action) => {
      state.vscodeApi = null;
    }
  }
});

export const {resetConnection} = vsCodeSlice.actions;

export default vsCodeSlice.reducer;
