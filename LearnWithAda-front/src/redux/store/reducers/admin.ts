import { RootState } from './../index';
import { getUserPassedLessons } from './../../actions/user.actions';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { ReducerNames } from '../reducerNames';
import { UserCourse, UserInterface } from '../../../core/models/user';
import { editUserRole, getUsers } from './../../actions';
import { AdminData as initialStateProps } from '../../../core/models/admin';
import { inviteUserToBusiness } from './../../actions/user.actions';

const admin = createSlice<
    initialStateProps,
    SliceCaseReducers<initialStateProps>,
    ReducerNames.ADMIN
>({
    name: ReducerNames.ADMIN,
    initialState: {
        users: [] as UserInterface[],
        revalidate: false,
        loading: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getUsers.fulfilled, (state: initialStateProps, { payload }) => {
            state.users = payload;
            state.revalidate = false;
        });
        builder.addCase(editUserRole.fulfilled, (state: initialStateProps) => {
            state.revalidate = true;
        });
        builder.addCase(getUserPassedLessons.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getUserPassedLessons.fulfilled,
            (state: initialStateProps, { payload: { courseId, passed, total, userId } }) => {
                const user = state.users.find((item: UserInterface) => item.id === userId);
                const course = user?.courses?.find((item: UserCourse) => item.course === courseId);
                if (course) {
                    course.passedLessons = passed;
                    course.totalLessons = total;
                }
                state.loading = false;
            },
        );
        builder.addCase(getUserPassedLessons.rejected, state => {
            state.loading = false;
        });
        builder.addCase(inviteUserToBusiness.pending, state => {
            state.loading = true;
        });
        builder.addCase(inviteUserToBusiness.rejected, state => {
            state.loading = false;
        });
        builder.addCase(inviteUserToBusiness.fulfilled, (state: initialStateProps) => {
            state.loading = false;
            state.revalidate = true;
        });
    },
});
export const adminSelect = (state: RootState) => state[ReducerNames.ADMIN];
export default admin.reducer;
