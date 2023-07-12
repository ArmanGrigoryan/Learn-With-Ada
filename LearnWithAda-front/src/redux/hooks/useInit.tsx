import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthDataKeys, AuthResult, RoleTypes } from '../../utils/constants';
import { useJwt } from 'react-jwt';
import {
    getBusinessAll,
    getCourses,
    getLessons,
    getNewNotifications,
    getNotifications,
    getTopics,
    getUsers,
    setUserDataFromLocalStorage,
} from '../actions';
import { DecodedToken } from '../../core/models/user';
import { getGroupAll } from '../actions/group.actions';
import {
    adminSelect,
    authSelect,
    businessSelect,
    courseSelect,
    groupSelect,
    lessonSelect,
    notificationSelect,
    topicSelect,
    userSelect,
} from '../store/reducers';

export const useInit = () => {
    const dispatch = useDispatch();
    const { result } = useSelector(authSelect);
    const { revalidate: topicRevalidate } = useSelector(topicSelect);
    const { revalidate: lessonRevalidate } = useSelector(lessonSelect);
    const { revalidate: businessRevalidate } = useSelector(businessSelect);
    const { revalidate: adminRevalidate } = useSelector(adminSelect);
    const { revalidate: userRevalidate } = useSelector(userSelect);
    const { revalidate: courseRevalidate } = useSelector(courseSelect);
    const { revalidate: notificationRevalidate } = useSelector(notificationSelect);
    const { revalidate: groupRevalidate } = useSelector(groupSelect);
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const role = decodedToken?.role;
    if (role === RoleTypes.USER) localStorage.setItem(AuthDataKeys.STATUS, '1');
    if (role === RoleTypes.BUSINESS_ADMIN) localStorage.setItem(AuthDataKeys.STATUS, '2');
    const authorized =
        result === AuthResult.SUCCESS ||
        (result === AuthResult.NONE && Boolean(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN)));
    useEffect(() => {
        if (authorized) {
            dispatch(getTopics());
            dispatch(getCourses());
            dispatch(getNotifications({ isNew: 'true' }));
            dispatch(getGroupAll());
            dispatch(getBusinessAll());
            dispatch(setUserDataFromLocalStorage());
        }
    }, [authorized, dispatch]);
    useEffect(() => {
        if (role && role !== RoleTypes.USER) {
            dispatch(getUsers());
            dispatch(getLessons());
        }
    }, [dispatch, role]);
    useEffect(() => {
        if (adminRevalidate) {
            role !== RoleTypes.USER && dispatch(getUsers());
            dispatch(getBusinessAll());
        } else if (groupRevalidate) {
            dispatch(getGroupAll());
            if (role !== RoleTypes.USER) dispatch(getBusinessAll());
        } else if (businessRevalidate) {
            dispatch(getBusinessAll());
        } else if (courseRevalidate || lessonRevalidate || topicRevalidate) {
            dispatch(getTopics());
            dispatch(getLessons());
            dispatch(getCourses());
        } else if (notificationRevalidate && role === RoleTypes.USER) {
            dispatch(getNewNotifications());
            dispatch(getNotifications({ isNew: 'true' }));
        }
    }, [
        dispatch,
        adminRevalidate,
        businessRevalidate,
        courseRevalidate,
        groupRevalidate,
        lessonRevalidate,
        notificationRevalidate,
        role,
        topicRevalidate,
        userRevalidate,
    ]);
    return useMemo(
        () => ({
            authorized,
            decodedToken,
        }),
        [authorized, decodedToken],
    );
};
