"use client";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/themeSlice";
import fontSizeReducer from "@/features/fontSize";
import quickStartReducer from "@/features/quickStartSlice";
import focusModeSlice from "@/features/focusMode";
import hideExtraElementsReducer from "@/features/hideExtraElements";
import soundReducer from "@/features/sound";
import hideCapsLockReducer from "@/features/hideCapsLock";
import paceCaretStyleReducer from "@/features/paceCaretStyle";
import isTypingReducer from "@/features/isTyping";
import blindEffectsReducer from "@/features/blindEffects";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    quickStart: quickStartReducer,
    focusMode: focusModeSlice,
    hideExtraElements: hideExtraElementsReducer,
    sound: soundReducer,
    hideCapsLock: hideCapsLockReducer,
    paceCaretStyle: paceCaretStyleReducer,
    isTyping: isTypingReducer,
    fontSize: fontSizeReducer,
    blindEffect: blindEffectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
