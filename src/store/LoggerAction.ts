import {
    createSlice,
    PayloadAction,
    SliceCaseReducers,
} from '@reduxjs/toolkit';
import { LoggerCollection } from './FirestoreInterfaces';

const loggerSlice = createSlice<
    LoggerCollection,
    SliceCaseReducers<LoggerCollection>
>({
    name: 'loggers',
    initialState: {},
    reducers: {
        updateLoggers(state, action: PayloadAction<LoggerCollection>) {
            return action.payload;
        },
    },
});

export const { updateLoggers } = loggerSlice.actions;
export default loggerSlice;
