"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: string 
}

const initialState: CounterState = {
  value: localStorage.getItem("paceCaretStyle") ?? "rightline",
};

export const paceCaretStyleSlice = createSlice({
  name: 'paceCaretStyle',
  initialState,
  reducers: {
    togglePaceCaretStyle: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { togglePaceCaretStyle } = paceCaretStyleSlice.actions;

export default paceCaretStyleSlice.reducer;
