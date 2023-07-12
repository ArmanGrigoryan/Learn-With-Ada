import { RootState } from './../index';
import {
    editUserRole,
    getUserInvitedBusinesses,
    setUserDataFromLocalStorage,
} from './../../actions/user.actions';
import { ReducerNames } from '../reducerNames';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { signIn, signUp, signUpToken } from '../../actions';
import { UserInterface } from '../../../core/models/user';
import { CourseData } from '../../../core/models/course';
import { LoadInterface } from '../../../utils/interfaces';
import { BusinessData } from '../../../core/models';

type RevUserInterface = {
    revalidate?: boolean;
    loading: LoadInterface;
    courseList: CourseData[];
    navigateHome?: () => void;
} & UserInterface;

const userSlice = createSlice<
    RevUserInterface,
    SliceCaseReducers<RevUserInterface>,
    ReducerNames.USER
>({
    name: ReducerNames.USER,
    initialState: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        courses: [],
        courseList: [],
        loading: {} as LoadInterface,
        revalidate: false,
        businesses: [],
    } as RevUserInterface,
    reducers: {
        setUserLoading: (state: RevUserInterface, { payload: { id } }) => {
            state.loading[id] = true;
        },
        addBusiness: (state: RevUserInterface, { payload: { businessId, businessName } }) => {
            const ext = state?.businesses?.find(each => each.id == businessId);
            if (!ext)
                state?.businesses?.push({
                    id: businessId,
                    name: businessName,
                });
        },
    },
    extraReducers: builder => {
        builder.addCase(
            signUp.fulfilled,
            (state, { payload: { email, firstName, lastName, id } }) => {
                state.id = id;
                state.email = email;
                state.firstName = firstName;
                state.lastName = lastName;
                state.role = 'user';
            },
        );
        builder.addCase(
            signUpToken.fulfilled,
            (state, { payload: { email, firstName, lastName, id, role } }) => {
                state.id = id;
                state.email = email;
                state.firstName = firstName;
                state.lastName = lastName;
                state.role = role || 'user';
                state.revalidate = true;
            },
        );
        builder.addCase(
            signIn.fulfilled,
            (state, { payload: { id, courses, email, firstName, lastName, role } }) => {
                state.id = id;
                state.courses = courses;
                state.courseList = courses;
                state.email = email;
                state.firstName = firstName;
                state.lastName = lastName;
                state.role = role || 'user';
                state.revalidate = true;
            },
        );
        builder.addCase(
            setUserDataFromLocalStorage.fulfilled,
            (state, { payload: { id, courses, email, firstName, lastName, role } }) => {
                state.id = id as string;
                state.courses = courses;
                state.courseList = courses;
                state.email = email as string;
                state.firstName = firstName as string;
                state.lastName = lastName as string;
                state.role = role || 'user';
                state.revalidate = true;
            },
        );
        builder.addCase(editUserRole.fulfilled, (state, { payload: { id } }) => {
            state.loading[id as string] = false;
            state.revalidate = true;
        });
        builder.addCase(
            getUserInvitedBusinesses.fulfilled,
            (
                state,
                {
                    payload: {
                        data: { businesses, members },
                    },
                },
            ) => {
                const newBusinesses = businesses.map(
                    (each: BusinessData & { User: UserInterface }) => {
                        const data = {
                            id: each.id,
                            name: each.name,
                            inviter: `${each.User.firstName} ${each.User.lastName}`,
                            inviterEmail: each.User.email,
                            membersCount: members.length,
                        };
                        return data;
                    },
                );
                state.businesses = newBusinesses;
                state.revalidate = false;
            },
        );
    },
});
export const { setUserLoading } = userSlice.actions;
export const userSelect = (state: RootState) => state[ReducerNames.USER];
export default userSlice.reducer;
