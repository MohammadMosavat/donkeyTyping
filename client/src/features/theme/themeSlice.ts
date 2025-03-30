"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: string 
}

const removeThemePrefix = (theme: string): string => {
  return theme.replace(/^theme-/, "");
};

const initialState: CounterState = {
  value: removeThemePrefix(localStorage.getItem("theme") ?? "theme-dark"),
};

export const counterSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state, action: PayloadAction<string>) => {
      state.value = removeThemePrefix(action.payload);
    },
  },
})

export const { toggleTheme } = counterSlice.actions;

export default counterSlice.reducer;
