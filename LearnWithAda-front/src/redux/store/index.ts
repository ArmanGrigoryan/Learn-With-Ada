import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import topicReducer from './reducers/topic';
import lessonReducer from './reducers/lesson';
import adminReducer from './reducers/admin';
import courseReducer from './reducers/course';
import notificationReducer from './reducers/notification';
import groupReducer from './reducers/group';
import businessReducer from './reducers/business';
import { ReducerNames } from './reducerNames';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        [ReducerNames.AUTH]: authReducer,
        [ReducerNames.USER]: userReducer,
        [ReducerNames.TOPIC]: topicReducer,
        [ReducerNames.LESSON]: lessonReducer,
        [ReducerNames.ADMIN]: adminReducer,
        [ReducerNames.COURSE]: courseReducer,
        [ReducerNames.NOTIFICATION]: notificationReducer,
        [ReducerNames.GROUP]: groupReducer,
        [ReducerNames.BUSINESS]: businessReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
