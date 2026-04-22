"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FontSizeState {
  value: string 
}

const initialState: FontSizeState = {
  value: localStorage.getItem("fontSize") ?? "16",
};

export const fontSizeSlice = createSlice({
  name: 'fontSize',
  initialState,
  reducers: {
    toggleFontSize: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { toggleFontSize } = fontSizeSlice.actions;

export default fontSizeSlice.reducer;
