import { createAction, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { ChannelTemplateCollection } from './FirestoreInterfaces';


const updateChannelTemplatesSlice = createSlice<ChannelTemplateCollection, SliceCaseReducers<ChannelTemplateCollection>>({
    name: 'templates',
    initialState: {},
    reducers: {
        updateChannelTemplates(state, action: PayloadAction<any>) {
            return action.payload;
        },
    },
});

export const { updateChannelTemplates } = updateChannelTemplatesSlice.actions;
export default updateChannelTemplatesSlice;
