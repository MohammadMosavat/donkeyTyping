"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: string 
}

const initialState: CounterState = {
  value: localStorage.getItem("hideExtraElements") ?? "off",
};

export const hideExtraElementsSlice = createSlice({
  name: 'hideExtraElements',
  initialState,
  reducers: {
    togglehideExtraElements: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { togglehideExtraElements } = hideExtraElementsSlice.actions;

export default hideExtraElementsSlice.reducer;
