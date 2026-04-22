"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: string 
}

const initialState: CounterState = {
  value: localStorage.getItem("quickStart") ?? "default",
};

export const quickStartSlice = createSlice({
  name: 'quickStart',
  initialState,
  reducers: {
    toggleQuickStart: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { toggleQuickStart } = quickStartSlice.actions;

export default quickStartSlice.reducer;
