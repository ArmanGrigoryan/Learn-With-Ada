import { RootState } from './../index';
import { getNewNotifications } from './../../actions/notification.actions';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { ReducerNames } from '../reducerNames';
import { NotificationData } from '../../../core/models/notification';
import { addNotification, getNotifications, editNotification } from '../../actions';
import { InitialNotificationData } from '../../../utils/interfaces';

const notificationSlice = createSlice<
    InitialNotificationData,
    SliceCaseReducers<InitialNotificationData>,
    ReducerNames.NOTIFICATION
>({
    name: ReducerNames.NOTIFICATION,
    initialState: {
        notifications: [] as NotificationData[],
        newNotifications: [] as NotificationData[],
        newNotificationsCount: 0,
        count: 0,
        revalidate: false,
    },
    reducers: {
        getNotification: (state, { payload: notification }) => {
            state.notifications = [...state.newNotifications, notification];
            state.revalidate = true;
        },
        addRevalidate: (state, { payload }) => {
            state.revalidate = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(addNotification.rejected, state => {
            state.revalidate = false;
        });
        builder.addCase(addNotification.fulfilled, state => {
            state.revalidate = true;
        });
        builder.addCase(getNotifications.pending, state => {
            state.loading = true;
        });
        builder.addCase(getNotifications.fulfilled, (state, { payload: { data } }) => {
            state.notifications = data?.userNotifications;
            state.count = data?.count;
            state.revalidate = false;
            state.loading = false;
        });
        builder.addCase(getNewNotifications.fulfilled, (state, { payload: { data } }) => {
            state.newNotifications = data?.userNotifications;
            state.newNotificationsCount = data?.count;
            state.revalidate = false;
            state.loading = false;
        });
        builder.addCase(editNotification.fulfilled, state => {
            state.revalidate = true;
            state.newNotificationsCount = 0;
        });
    },
});
export const { getNotification, addRevalidate } = notificationSlice.actions;
export const notificationSelect = (state: RootState) => state[ReducerNames.NOTIFICATION];
export default notificationSlice.reducer;
