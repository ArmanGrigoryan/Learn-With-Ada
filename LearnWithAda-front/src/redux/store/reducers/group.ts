import { RootState } from './../index';
import { UserInterface } from '../../../core/models/user';
import { CourseData } from './../../../core/models/course/index';
import { getGroupProgress, updateGroupUserCourse } from '../../actions/group.actions';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import {
    createGroup,
    deleteGroup,
    getGroup,
    getGroupAll,
    updateGroup,
} from '../../actions/group.actions';
import { ReducerNames } from '../reducerNames';
import { GroupStateProps, ProgressData } from '../../../utils/interfaces';
import { GroupData } from '../../../core/models/group';

const group = createSlice<GroupStateProps, SliceCaseReducers<GroupStateProps>, ReducerNames.GROUP>({
    name: ReducerNames.GROUP,
    initialState: {
        groups: [],
        revalidate: false,
        loadGroups: {},
        loadUsers: {},
        loadCourses: {},
        loading: false,
        totalProgress: [],
    },
    reducers: {
        setGroupLoading: (state: GroupStateProps, { payload: id }) => {
            state.loadGroups[id as string] = true;
        },
        setGroupCourseLoading: (state: GroupStateProps, { payload: id }) => {
            state.loadCourses[id as string] = true;
        },
        setGroupUserLoading: (state: GroupStateProps, { payload: id }) => {
            state.loadUsers[id as string] = true;
        },
    },
    extraReducers: builder => {
        builder.addCase(createGroup.pending, (state: GroupStateProps) => {
            state.loading = true;
        });
        builder.addCase(createGroup.rejected, (state: GroupStateProps) => {
            state.loading = false;
        });
        builder.addCase(createGroup.fulfilled, (state: GroupStateProps) => {
            state.revalidate = true;
            state.loading = false;
        });
        builder.addCase(updateGroup.pending, (state: GroupStateProps) => {
            state.loading = true;
        });
        builder.addCase(updateGroup.rejected, (state: GroupStateProps) => {
            state.loading = false;
        });
        builder.addCase(
            updateGroupUserCourse.fulfilled,
            (state: GroupStateProps, { payload: { id, Courses, Users } }) => {
                const group = state.groups.find(group => group.id == id) as GroupData;
                const courseIds = Courses.map((each: CourseData) => each.id);
                const userIds = Users.map((each: UserInterface) => each.id);
                group.courseIds = courseIds;
                group.userIds = userIds;
                state.loadCourses[id] = false;
                state.loadUsers[id] = false;
                state.revalidate = true;
            },
        );
        builder.addCase(updateGroupUserCourse.rejected, (state: GroupStateProps) => {
            state.loadCourses = {};
            state.loadUsers = {};
        });
        builder.addCase(
            updateGroup.fulfilled,
            (state: GroupStateProps, { payload: { name, id } }) => {
                const group = state.groups.find(item => item.id == id) as GroupData;
                group.name = name;
                state.loading = false;
                state.revalidate = true;
            },
        );
        builder.addCase(deleteGroup.fulfilled, (state: GroupStateProps, { payload: { id } }) => {
            delete state.loadGroups[id as string];
            state.groups = state.groups.filter(item => item.id !== id);
            state.revalidate = true;
        });
        builder.addCase(
            getGroup.fulfilled,
            (
                state: GroupStateProps,
                { payload: { id, name, creator, businessId, Courses, Users } },
            ) => {
                const courseIds = Courses.map((each: CourseData) => each.id);
                const userIds = Users.map((each: UserInterface) => each.id);
                const newGroup = {
                    name,
                    courseIds,
                    userIds,
                    creator,
                    businessId,
                    id,
                };
                state.groups.push(newGroup);
                state.revalidate = false;
            },
        );
        builder.addCase(
            getGroupAll.fulfilled,
            (state: GroupStateProps, { payload: { data: groups } }) => {
                const newGroups = groups.map(
                    ({
                        id,
                        creator,
                        name,
                        businessId,
                        Users,
                        Courses,
                    }: GroupData & {
                        id: string;
                        Users: UserInterface[];
                        Courses: CourseData[];
                    }) => {
                        const courseIds = Courses.map((each: CourseData) => each.id);
                        const userIds = Users.map((each: UserInterface) => each.id);
                        return {
                            id,
                            creator,
                            name,
                            businessId,
                            courseIds,
                            userIds,
                        };
                    },
                );
                state.groups = newGroups;
                state.revalidate = false;
            },
        );
        builder.addCase(getGroupProgress.rejected, (state: GroupStateProps) => {
            state.loading = false;
        });
        builder.addCase(
            getGroupProgress.fulfilled,
            (state: GroupStateProps, { payload: { data } }) => {
                let maxCount = data[0]?.userCount;
                for (let i = 1; i < data.length; i++) {
                    if (data[i].courseId === data[0].courseId) {
                        maxCount += data[i].userCount;
                    }
                }
                const newData = data.map((each: ProgressData) => {
                    return { ...each, maxCount };
                });
                state.totalProgress = newData;
                state.loading = false;
            },
        );
    },
});

export const { setGroupLoading, setGroupCourseLoading, setGroupUserLoading } = group.actions;
export const groupSelect = (state: RootState) => state[ReducerNames.GROUP];
export default group.reducer;
