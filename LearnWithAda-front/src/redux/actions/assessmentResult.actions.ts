import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from '../axios';
import { AssessmentResultData } from '../../core/models/user';

export const createAssessmentResult = createAsyncThunk(
    'assessmentResult/add',
    async (results: AssessmentResultData & { navigateHome: () => void }) => {
        const {
            data: { data },
        } = await axios.post('assessmentResult', results);
        results.navigateHome();
        message.info(`Your score is ${data.score}!!!`);
        return {
            data,
        };
    },
);
