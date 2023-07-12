import { setAuthInfo, setUserDataFromLocalStorage, signUpToken } from './../../../redux/actions';
import { RoutePath } from './../../../routes/routes';
import { clearAuthInfo } from './../../actions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReducerNames } from '../reducerNames';
import { AuthData } from '../../../core/models/user';
import { AuthDataKeys, AuthResult, UserStoreDataKeys } from '../../../utils/constants';
import { SignInPostErrorCodes, SignupPostErrorCodes } from '../../../core/models/user';
import { signIn, signUp } from '../../actions';
import { AuthSliceState } from '../../../utils/interfaces';
import { RootState } from '..';

const authSlice = createSlice({
    name: ReducerNames.AUTH,
    initialState: {
        accessToken: '',
        pending: false,
        result: AuthResult.NONE,
        emailErrorText: '',
        passwordErrorText: '',
    },
    reducers: {
        clearEmailError: {
            reducer: (state: AuthSliceState) => {
                state.emailErrorText = '';
            },
            prepare: () => {
                return {
                    payload: {},
                };
            },
        },
        clearPasswordError: {
            reducer: (state: AuthSliceState) => {
                state.passwordErrorText = '';
            },
            prepare: () => {
                return {
                    payload: {},
                };
            },
        },
        signOut: {
            reducer: (state: AuthSliceState) => {
                state.result = AuthResult.ERROR;
                state.accessToken = '';
                state.refreshToken = '';
                clearAuthInfo();
            },
            prepare: () => {
                return {
                    payload: {},
                };
            },
        },
        saveAuthTokens: {
            reducer: (
                state: AuthSliceState,
                { payload: { accessToken } }: PayloadAction<Omit<AuthData, AuthDataKeys.USER_ID>>,
            ) => {
                state.accessToken = accessToken;
            },
            prepare: ({ accessToken }: Omit<AuthData, AuthDataKeys.USER_ID>) => {
                return {
                    payload: {
                        accessToken,
                    },
                };
            },
        },
        successAuth: (state: AuthSliceState) => {
            state.result = AuthResult.SUCCESS;
        },
        failAuth: (state: AuthSliceState) => {
            state.result = AuthResult.ERROR;
        },
    },
    extraReducers: builder => {
        builder.addCase(signUp.pending, state => {
            state.pending = true;
        });
        builder.addCase(
            signUp.fulfilled,
            (state, { payload: { accessToken, firstName, lastName, email, role, id: userId } }) => {
                state.pending = false;
                state.result = AuthResult.SUCCESS;
                state.accessToken = accessToken;
                setAuthInfo({
                    accessToken,
                    userId,
                    firstName: firstName?.trim() || 'first_name',
                    lastName: lastName?.trim() || 'last_name',
                    email,
                    role,
                });
                if (sessionStorage.getItem(UserStoreDataKeys.INVITED))
                    window.location.href = RoutePath.USER_BUSINESSES;
            },
        );
        builder.addCase(signUpToken.pending, state => {
            state.pending = true;
        });
        builder.addCase(
            signUpToken.fulfilled,
            (state, { payload: { accessToken, firstName, lastName, email, role, id: userId } }) => {
                state.pending = false;
                state.result = AuthResult.SUCCESS;
                state.accessToken = accessToken;
                setAuthInfo({
                    accessToken,
                    userId,
                    firstName: firstName?.trim() || 'first_name',
                    lastName: lastName?.trim() || 'last_name',
                    email,
                    role,
                });
                const invited = sessionStorage.getItem(UserStoreDataKeys.INVITED);
                window.location.href = invited
                    ? RoutePath.USER_BUSINESSES
                    : (window.location.href = RoutePath.DASHBOARD);
            },
        );
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        builder.addCase(signUp.rejected, (state, { payload: payload }: any) => {
            if (payload.message === SignupPostErrorCodes.EMAIL_EXISTS) {
                state.emailErrorText = 'User is already registered';
            }
            state.pending = false;
            state.result = AuthResult.ERROR;
        });
        builder.addCase(
            setUserDataFromLocalStorage.fulfilled,
            (state, { payload: { accessToken } }) => {
                state.pending = false;
                state.result = AuthResult.SUCCESS;
                state.accessToken = accessToken as string;
            },
        );
        builder.addCase(signIn.pending, state => {
            state.pending = true;
        });
        builder.addCase(
            signIn.fulfilled,
            (
                state,
                { payload: { token: accessToken, firstName, lastName, email, role, id: userId } },
            ) => {
                state.pending = false;
                state.result = AuthResult.SUCCESS;
                state.accessToken = accessToken;
                setAuthInfo({
                    accessToken,
                    userId,
                    firstName,
                    lastName,
                    email,
                    role,
                });
                if (sessionStorage.getItem(UserStoreDataKeys.INVITED))
                    window.location.href = RoutePath.USER_BUSINESSES;
            },
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder.addCase<any>(signIn.rejected, (state, { payload }) => {
            if (
                payload?.message &&
                payload?.message === SignInPostErrorCodes.INVALID_PASSWORD_OR_EMAIL
            ) {
                state.passwordErrorText = 'Incorrect login or password. Please try again.';
            }
            state.pending = false;
            state.result = AuthResult.ERROR;
        });
    },
});

export const {
    clearEmailError,
    clearPasswordError,
    saveAuthTokens,
    successAuth,
    failAuth,
    signOut,
} = authSlice.actions;

export const authSelect = (state: RootState) => state[ReducerNames.AUTH];
export default authSlice.reducer;
