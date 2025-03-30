"use client";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/theme/themeSlice";
import quickStartReducer from "@/features/quickStart/quickStartSlice";
import focusModeSlice from "@/features/focusMode/focusMode";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    quickStart: quickStartReducer,
    focusMode: focusModeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
