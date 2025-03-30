"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FocusModeState {
  value: string 
}

const initialState: FocusModeState = {
  value: localStorage.getItem("focusMode") ?? "off",
};

export const focusModeSlice = createSlice({
  name: 'focusMode',
  initialState,
  reducers: {
    toggleFocusMode: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { toggleFocusMode } = focusModeSlice.actions;

export default focusModeSlice.reducer;
