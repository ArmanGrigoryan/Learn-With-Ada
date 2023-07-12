import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { RootState } from '..';
import { CourseData } from '../../../core/models/course';
import { initialCourseStateProps } from '../../../utils/interfaces';
import { ReducerNames } from '../reducerNames';
import {
    addCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    updateCourseAddUserTopic,
    addBusinessMemberToCourse,
} from './../../actions';

const course = createSlice<
    initialCourseStateProps,
    SliceCaseReducers<initialCourseStateProps>,
    ReducerNames.COURSE
>({
    name: ReducerNames.COURSE,
    initialState: {
        courses: [] as CourseData[],
        loadUsers: {},
        loadTopics: {},
        revalidate: false,
    },
    reducers: {
        onAddUserEnableLoading: (state: initialCourseStateProps, { payload: { userId = '' } }) => {
            state.loadUsers[userId] = true;
        },
        onAddTopicEnableLoading: (
            state: initialCourseStateProps,
            { payload: { topicId = '' } },
        ) => {
            state.loadTopics[topicId] = true;
        },
    },
    extraReducers: builder => {
        builder.addCase(addCourse.fulfilled, state => {
            state.revalidate = true;
        });
        builder.addCase(getCourses.fulfilled, (state, { payload: { data: courses } }) => {
            state.courses = courses;
            state.revalidate = false;
        });
        builder.addCase(updateCourse.fulfilled, state => {
            state.revalidate = true;
        });
        builder.addCase(
            updateCourseAddUserTopic.fulfilled,
            (state, { payload: { topicId = '', userId = '' } }) => {
                delete state.loadUsers[userId as string];
                delete state.loadTopics[topicId as string];
                state.revalidate = true;
            },
        );
        builder.addCase(updateCourseAddUserTopic.rejected, state => {
            state.revalidate = false;
        });
        builder.addCase(deleteCourse.fulfilled, state => {
            state.revalidate = true;
        });
        builder.addCase(addBusinessMemberToCourse.fulfilled, state => {
            state.revalidate = true;
        });
    },
});

export const { onAddUserEnableLoading, onAddTopicEnableLoading } = course.actions;
export const courseSelect = (state: RootState) => state[ReducerNames.COURSE];
export default course.reducer;
