import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';
import { TopicData, TopicDuplicationError } from '../../core/models/topic';

export const addTopic = createAsyncThunk(
    'topic/add',
    async (
        { courseId, name, lessons, navigateHome }: TopicData & { navigateHome: () => void },
        { rejectWithValue },
    ) => {
        try {
            const {
                data: { data },
            } = await axios.post('topic', {
                courseId,
                name,
                lessons,
            });
            navigateHome();
            return {
                data,
            };
        } catch (e: unknown) {
            return rejectWithValue({ message: TopicDuplicationError.DUPLICATION_ERROR });
        }
    },
);

export const editTopic = createAsyncThunk(
    'topic/edit',
    async ({
        id,
        courseId,
        name,
        lessons,
        navigateHome,
    }: TopicData & { navigateHome: () => void }) => {
        try {
            const {
                data: { data },
            } = await axios.put(`topic/${id}`, {
                courseId,
                name,
                lessons,
            });
            navigateHome();
            return {
                data,
            };
        } catch (e) {
            return null;
        }
    },
);

export const deleteTopic = createAsyncThunk('topic/delete', async (id: string) => {
    try {
        const { data } = await axios.delete(`topic/${id}`);
        return {
            data,
        };
    } catch (e) {
        return e;
    }
});

export const getTopics = createAsyncThunk('topics/get', async () => {
    const {
        data: { data },
    } = await axios.get('topic');
    return {
        data,
    };
});

export const getTopic = createAsyncThunk('topic/get', async (id: string) => {
    const {
        data: { data },
    } = await axios.get(`topic/${id}`);
    return {
        data,
    };
});

export const getOwnTopics = createAsyncThunk('get/topic/own', async (id?: string) => {
    const {
        data: { data },
    } = await axios.get(`topic/own/${id || 1}`);
    return {
        data,
    };
});
