import { editLesson } from './../../actions/lesson.actions';
import { createSlice } from '@reduxjs/toolkit';
import { ReducerNames } from '../reducerNames';
import { LessonGet } from '../../../core/models/lesson';
import { getLessons, addLesson, deleteLesson } from '../../actions';
import { RootState } from '..';

const lesson = createSlice({
    name: ReducerNames.LESSON,
    initialState: {
        lessons: [] as LessonGet[],
        revalidate: false,
        loading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(deleteLesson.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteLesson.fulfilled, state => {
            state.revalidate = true;
            state.loading = false;
        });
        builder.addCase(deleteLesson.rejected, state => {
            state.loading = false;
        });
        builder.addCase(addLesson.pending, state => {
            state.loading = true;
        });
        builder.addCase(addLesson.fulfilled, state => {
            state.revalidate = true;
            state.loading = false;
        });
        builder.addCase(addLesson.rejected, state => {
            state.revalidate = false;
            state.loading = false;
        });
        builder.addCase(editLesson.pending, state => {
            state.loading = true;
        });
        builder.addCase(editLesson.fulfilled, state => {
            state.revalidate = true;
            state.loading = false;
        });
        builder.addCase(editLesson.rejected, state => {
            state.revalidate = false;
            state.loading = false;
        });
        builder.addCase(getLessons.fulfilled, (state, { payload: { data } }) => {
            state.lessons = data;
            state.revalidate = false;
            state.loading = false;
        });
    },
});

export const lessonSelect = (state: RootState) => state[ReducerNames.LESSON];
export default lesson.reducer;
