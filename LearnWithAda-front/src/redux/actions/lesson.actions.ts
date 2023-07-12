import { LessonGet } from '../../core/models/lesson';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const addLesson = createAsyncThunk(
    'lesson/add',
    async ({
        topicId,
        instruction,
        instructionFile,
        assessmentQuestion,
        answerChoices,
        simpleAnswer,
        file,
        navigateHome,
    }: LessonGet & { navigateHome: () => void; file?: File; instructionFile?: string }) => {
        const formData = new FormData();
        const sendData = {
            topicId,
            instruction: {
                instruction,
                instructionFile,
            },
            assessmentQuestion,
            answerChoices,
            simpleAnswer,
        };
        formData.append('formData', JSON.stringify(sendData));
        formData.append('file', file || '');
        const {
            data: { data },
        } = await axios.post('lesson', formData);
        navigateHome();
        return {
            data,
        };
    },
);

export const editLesson = createAsyncThunk(
    'lesson/edit',
    async ({
        id,
        topicId,
        instruction,
        instructionFile,
        assessmentQuestion,
        answerChoices,
        simpleAnswer,
        file,
        navigateHome,
    }: LessonGet & { navigateHome: () => void; file?: File; instructionFile?: string }) => {
        const formData = new FormData();
        const sendData = {
            topicId,
            instruction: {
                instruction,
                instructionFile,
            },
            assessmentQuestion,
            answerChoices,
            simpleAnswer,
        };
        formData.append('formData', JSON.stringify(sendData));
        formData.append('file', file || '');
        const {
            data: { data },
        } = await axios.put(`lesson/${id}`, formData);
        navigateHome();
        return {
            data,
        };
    },
);

export const deleteLesson = createAsyncThunk('lesson/delete', async (id: string) => {
    const {
        data: { data },
    } = await axios.delete(`lesson/${id}`);
    return {
        data,
    };
});

export const getLessons = createAsyncThunk('lessons/get', async () => {
    const {
        data: { data },
    } = await axios.get('lesson');
    return {
        data,
    };
});

export const getLesson = createAsyncThunk('lesson/get', async (id: string) => {
    const {
        data: { data },
    } = await axios.get(`lesson/${id}`);
    return {
        data,
    };
});
