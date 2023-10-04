import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthenticationSliceModel} from "../models/authentication-slice.model";


const initialState: AuthenticationSliceModel = {
   token:undefined
};
export const authenticationSlice = createSlice({
    name: "authentication", initialState: initialState, reducers: {
        setToken: (state, action: PayloadAction<string|undefined>) => {
            state.token = action.payload;
        },
    },
});

export const {
    setToken,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
