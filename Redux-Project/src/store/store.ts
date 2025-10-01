import { configureStore } from "@reduxjs/toolkit";
import habbitSlice from "./habit-slice";

const store = configureStore({
    reducer: {
        habit: habbitSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type Appdispatch = typeof store.dispatch
export default store;