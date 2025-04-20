"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: string 
}

const initialState: CounterState = {
  value:"off",
};

export const isTypingSlice = createSlice({
  name: 'isTyping',
  initialState,
  reducers: {
    toggleIsTyping: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { toggleIsTyping } = isTypingSlice.actions;

export default isTypingSlice.reducer;
