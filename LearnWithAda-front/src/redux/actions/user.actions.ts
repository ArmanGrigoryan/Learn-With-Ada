import { ResponseSignData } from './../../utils/interfaces';
import { UserCourse, UserInterface } from '../../core/models/user';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SignUpData, SignInData, AuthData } from '../../core/models/user';
import { AuthDataKeys, UserStoreDataKeys } from '../../utils/constants';
import axios from '../axios';

export const setAuthInfo = (data: AuthData) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${data[AuthDataKeys.ACCESS_TOKEN]}`;
    localStorage.setItem(AuthDataKeys.ACCESS_TOKEN, data[AuthDataKeys.ACCESS_TOKEN]);
    localStorage.setItem(AuthDataKeys.FIRSTNAME, data[AuthDataKeys.FIRSTNAME] as string);
    localStorage.setItem(AuthDataKeys.LASTNAME, data[AuthDataKeys.LASTNAME] as string);
    localStorage.setItem(AuthDataKeys.ROLE, data[AuthDataKeys.ROLE] as string);
    localStorage.setItem(AuthDataKeys.EMAIL, data[AuthDataKeys.EMAIL] as string);
    localStorage.setItem(AuthDataKeys.USER_ID, data[AuthDataKeys.USER_ID] as string);
};

export const clearAuthInfo = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(AuthDataKeys.ACCESS_TOKEN);
    localStorage.removeItem(AuthDataKeys.USER_ID);
    localStorage.removeItem(AuthDataKeys.STATUS);
    localStorage.removeItem(AuthDataKeys.ROLE);
    localStorage.removeItem(AuthDataKeys.EMAIL);
    localStorage.removeItem(UserStoreDataKeys.LAST_NAME);
    localStorage.removeItem(UserStoreDataKeys.FIRST_NAME);
    sessionStorage.removeItem(UserStoreDataKeys.INVITED);
};

export const signIn = createAsyncThunk(
    'user/signin',
    async (
        { email, password, navigateHome }: SignInData & { navigateHome: () => void },
        { rejectWithValue },
    ) => {
        const {
            data: { data, message },
        } = await axios.post('user/signin', {
            email,
            password,
        });
        if (!data) {
            return rejectWithValue({
                error: true,
                data: null,
                message,
            });
        }
        navigateHome();
        return data;
    },
);

export const signUp = createAsyncThunk(
    'auth/signup',
    async (
        {
            email,
            firstName,
            lastName,
            password,
            role = 'user',
            navigateHome,
        }: SignUpData & { navigateHome: () => void },
        { rejectWithValue },
    ): Promise<ResponseSignData | ReturnType<typeof rejectWithValue>> => {
        const { data } = await axios.post('user/signup', {
            password,
            lastName,
            email,
            firstName,
            role,
        });
        if (!data) {
            return rejectWithValue({
                error: true,
                data: null,
                message: data.message,
            });
        }
        navigateHome();
        return {
            email,
            firstName,
            lastName,
            role,
            [UserStoreDataKeys.ID]: data.data.id,
            [AuthDataKeys.ACCESS_TOKEN]: data.data.token,
        };
    },
);

export const signUpToken = createAsyncThunk(
    'auth/signupToken',
    async (
        { firstName, lastName, password }: SignUpData & { navigateHome: () => void },
        { rejectWithValue },
    ) => {
        const token = sessionStorage.getItem(UserStoreDataKeys.INVITED);
        const {
            data: { data },
        } = await axios.put('user/register/1', {
            password,
            lastName,
            firstName,
            token,
        });
        if (!data) {
            return rejectWithValue({
                error: true,
                data: null,
                message: data.message,
            });
        }
        return {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            id: data.id,
            role: data.role,
            [AuthDataKeys.ACCESS_TOKEN]: data.token,
        };
    },
);

export const setUserDataFromLocalStorage = createAsyncThunk('admin/setUserData', async () => {
    const email = localStorage.getItem(UserStoreDataKeys.EMAIL);
    const firstName = localStorage.getItem(UserStoreDataKeys.FIRST_NAME);
    const lastName = localStorage.getItem(UserStoreDataKeys.LAST_NAME);
    const id = localStorage.getItem(AuthDataKeys.USER_ID);
    const role = localStorage.getItem(AuthDataKeys.ROLE);
    const accessToken = localStorage.getItem(AuthDataKeys.ACCESS_TOKEN);
    const data = {
        id,
        email,
        firstName,
        lastName,
        role,
        courses: [],
        accessToken,
    };
    return Promise.resolve(data);
});

export const getUsers = createAsyncThunk('admin/users', async () => {
    // const token = localStorage.getItem(UserStoreDataKeys.TOKEN);
    const {
        data: { data },
    } = await axios.get('user');
    const storeData = data.map(
        (user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            courses: UserCourse[];
        }) => ({
            [UserStoreDataKeys.ID]: user.id,
            [UserStoreDataKeys.EMAIL]: user.email,
            [UserStoreDataKeys.LAST_NAME]: user.lastName,
            [UserStoreDataKeys.FIRST_NAME]: user.firstName,
            [UserStoreDataKeys.ROLE]: user.role,
            [UserStoreDataKeys.COURSES]: user.courses,
        }),
    );
    return storeData;
});

export const editUserRole = createAsyncThunk('edit/role', async (user: Partial<UserInterface>) => {
    await axios.put(`user/${user.id}`, { role: user.role });
    return { id: user.id };
});

export const getUserPassedLessons = createAsyncThunk(
    'admin/userPassedLessons',
    async ({ userId, courseId }: { userId: string; courseId: string }) => {
        const result = await axios.get(`user/result/${userId}/${courseId}`);
        return { ...result.data.data, userId };
    },
);

export const inviteUserToBusiness = createAsyncThunk(
    'business/inviteUser',
    async ({
        email,
        userToInvite,
        businessId,
        navigateHandler,
    }: {
        email: string;
        userToInvite: string;
        businessId: string;
        navigateHandler: () => void;
    }) => {
        const { data } = await axios.put('business/invite', {
            email,
            userToInvite,
            businessId,
        });
        navigateHandler();
        return data;
    },
);

export const getUserInvitedBusinesses = createAsyncThunk('user/invited-businesses', async () => {
    const userId = localStorage.getItem(AuthDataKeys.USER_ID);
    const {
        data: { data },
    } = await axios.get(`business/user/${userId}`);
    return { data };
});
