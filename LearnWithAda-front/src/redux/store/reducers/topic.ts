import { RootState } from './../index';
import { TopicState } from './../../../utils/interfaces';
import { editTopic } from './../../actions/topic.actions';
import { createSlice } from '@reduxjs/toolkit';
import { ReducerNames } from '../reducerNames';
import { TopicData } from '../../../core/models/topic';
import { getTopics, addTopic, deleteTopic } from './../../actions';

const topic = createSlice({
    name: ReducerNames.TOPIC,
    initialState: {
        topics: [] as TopicData[],
        revalidate: false,
        error: false,
    },
    reducers: {
        clearErrorText: (state: TopicState) => {
            state.error = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(addTopic.rejected, state => {
            state.revalidate = false;
        });
        builder.addCase(addTopic.fulfilled, state => {
            state.revalidate = true;
            state.error = false;
        });
        builder.addCase(getTopics.fulfilled, (state, { payload: { data } }) => {
            state.topics = data;
            state.revalidate = false;
        });
        builder.addCase(deleteTopic.fulfilled, state => {
            state.revalidate = true;
        });
        builder.addCase(editTopic.fulfilled, state => {
            state.revalidate = true;
        });
    },
});
export const { clearErrorText } = topic.actions;
export const topicSelect = (state: RootState) => state[ReducerNames.TOPIC];
export default topic.reducer;
