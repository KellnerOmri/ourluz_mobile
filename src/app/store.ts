import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {globalSlice} from "../store/global.slice";
import {authenticationSlice} from "../store/authentication.slice";

export const store = configureStore({
    reducer: {global: globalSlice.reducer, authentication: authenticationSlice.reducer},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
