/**
 * Redux management for firestore data
 */

import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const login_action = createAction('login');
export const logout_action = createAction('logout');

// userUID starts as null, firestore objects without authentication are undefined
export interface userUID {
    userUID: string | null | undefined;
}

export interface authPayload {
    userUID: string | null | undefined;
    privilege: string;
}

const initialState = {
    userUID: null,
    privilege: 'User',
} as authPayload;

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login(state, action: PayloadAction<authPayload>) {
            state.userUID = action.payload.userUID;
            state.privilege = action.payload.privilege;
        },
        logout(state) {
            state.userUID = null;
            state.privilege = 'User';
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
