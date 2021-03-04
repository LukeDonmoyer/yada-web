import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const updateUsers_action = createAction('updateUsers');

const initialState = {
    users: {},
};

const updateUsersSlice = createSlice({
    name: 'updateUsers',
    initialState,
    reducers: {
        updateUsers(state, action: PayloadAction<any>) {
            state.users = action.payload;
        },
    },
});

export const { updateUsers } = updateUsersSlice.actions;
export default updateUsersSlice;
