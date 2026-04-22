"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BlindEffectsState {
  value: string 
}

const initialState: BlindEffectsState = {
  value: localStorage.getItem("blindEffects") ?? "off",
};

export const blindEffectsSlice = createSlice({
  name: 'blindEffects',
  initialState,
  reducers: {
    toggleBlindEffects: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
})

export const { toggleBlindEffects } = blindEffectsSlice.actions;

export default blindEffectsSlice.reducer;
