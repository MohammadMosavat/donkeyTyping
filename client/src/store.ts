"use client";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/theme/themeSlice";
import quickStartReducer from "@/features/quickStart/quickStartSlice";
import focusModeSlice from "@/features/focusMode/focusMode";
import hideExtraElementsReducer from "@/features/hideExtraElements/hideExtraElements";
import soundReducer from "@/features/sound/sound";
import hideCapsLockReducer from "@/features/hideCapsLock/hideCapsLock";
import paceCaretStyleReducer from "@/features/paceCaretStyle/paceCaretStyle";
import isTypingReducer from "@/features/isTyping/isTyping";
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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
