import { RootState } from './../index';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import {
    addBusinessMemberToCourse,
    changeBusinessMemberStatus,
    createBusiness,
    deleteBusiness,
    getBusiness,
    getBusinessAll,
    updateBusiness,
} from '../../actions/business.actions';
import { ReducerNames } from '../reducerNames';
import { BusinessStateProps, LoadInterface } from '../../../utils/interfaces';
import { BusinessData } from '../../../core/models/business';
import { AuthDataKeys } from '../../../utils/constants';
import axios from '../../axios';

const business = createSlice<
    BusinessStateProps,
    SliceCaseReducers<BusinessStateProps>,
    ReducerNames.BUSINESS
>({
    name: ReducerNames.BUSINESS,
    initialState: {
        businesses: [],
        revalidate: false,
        loading: false,
        loadUsers: {} as LoadInterface,
    },
    reducers: {
        setMemberLoading: (state: BusinessStateProps, { payload: { id } }) => {
            state.loadUsers[id] = true;
        },
    },
    extraReducers: builder => {
        builder.addCase(createBusiness.pending, (state: BusinessStateProps) => {
            state.loading = true;
        });
        builder.addCase(createBusiness.rejected, (state: BusinessStateProps) => {
            state.loading = false;
        });
        builder.addCase(
            createBusiness.fulfilled,
            (
                state: BusinessStateProps,
                { payload: { name, creator, groupIds, members, id, token } },
            ) => {
                const newBusiness = {
                    name,
                    id,
                    creator,
                    groupIds,
                    members,
                };
                if (token) {
                    localStorage.setItem(AuthDataKeys.ACCESS_TOKEN, token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                state.businesses.push(newBusiness);
                state.revalidate = true;
                state.loading = false;
            },
        );
        builder.addCase(
            deleteBusiness.fulfilled,
            (state: BusinessStateProps, { payload: { id } }) => {
                state.businesses = state.businesses.filter(item => item.id != id);
                delete state.loadUsers[id];
                state.revalidate = true;
            },
        );
        builder.addCase(deleteBusiness.rejected, state => {
            state.loadUsers = {};
            state.revalidate = false;
        });
        builder.addCase(
            getBusiness.fulfilled,
            (state: BusinessStateProps, { payload: { name, creator, groupIds, members, id } }) => {
                const newBusiness = {
                    name,
                    id,
                    creator,
                    groupIds,
                    members,
                };
                state.businesses.push(newBusiness);
                state.revalidate = false;
            },
        );
        builder.addCase(
            getBusinessAll.fulfilled,
            (state: BusinessStateProps, { payload: { data } }) => {
                state.businesses = data;
                state.revalidate = false;
            },
        );
        builder.addCase(
            updateBusiness.fulfilled,
            (state: BusinessStateProps, { payload: { name, id } }) => {
                const business = state.businesses.find(item => item.id === id) as BusinessData;
                business.name = name;
                state.revalidate = true;
            },
        );
        builder.addCase(
            changeBusinessMemberStatus.fulfilled,
            (state: BusinessStateProps, { payload: { id, members, businessId } }) => {
                const business = state.businesses.find(each => each.id == businessId);
                (business as BusinessData).members = members;
                delete state.loadUsers[id];
                state.revalidate = true;
            },
        );
        builder.addCase(changeBusinessMemberStatus.rejected, (state: BusinessStateProps) => {
            const membersInLoading = state.loadUsers;
            for (const i in membersInLoading) {
                membersInLoading[i] = false;
            }
        });
        builder.addCase(addBusinessMemberToCourse.fulfilled, (state: BusinessStateProps) => {
            state.revalidate = true;
        });
    },
});
export const { setMemberLoading } = business.actions;
export const businessSelect = (state: RootState) => state[ReducerNames.BUSINESS];
export default business.reducer;
