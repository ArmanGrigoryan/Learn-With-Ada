import { CourseData, Visibility } from '../../core/models/course';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const addCourse = createAsyncThunk(
    'course/add',
    async ({
        name,
        description,
        price,
        createdByUserId,
        file,
        logo,
        currentPrice,
        visibility,
        navigateCoursePage,
    }: CourseData & {
        file?: File;
        currentPrice?: number;
        navigateCoursePage: () => void;
    }) => {
        const formData = new FormData();
        formData.append('myFiles', file as File);
        formData.append('name', name as string);
        formData.append('description', description as string);
        formData.append('price', '' + price);
        formData.append('currentPrice', '' + currentPrice);
        formData.append('visibility', visibility as Visibility);
        formData.append('createdByUserId', createdByUserId as string);
        logo && formData.append('logo', logo as string);
        const {
            data: { data },
        } = await axios.post('course', formData);
        navigateCoursePage();
        return {
            data,
        };
    },
);

export const getCourses = createAsyncThunk('course/get', async (query?: string) => {
    const queryString = query || '';
    const { data } = await axios.get(`course` + queryString);
    return data;
});

export const updateCourse = createAsyncThunk(
    'course/update',
    async (
        courseData: CourseData & {
            action?: string;
            userId?: string;
            file?: File;
            currPrice?: number;
            navigateCoursePage?: () => void;
        },
    ) => {
        const formData = new FormData();
        formData.append('myFiles', courseData.file as File);
        formData.append('id', courseData.id as string);
        formData.append('name', courseData.name as string);
        formData.append('description', courseData.description as string);
        formData.append('price', '' + courseData.price);
        formData.append('currentPrice', '' + (courseData.currentPrice || 0));
        formData.append('visibility', courseData.visibility as Visibility);
        courseData.logo && formData.append('logo', courseData.logo as string);
        await axios.put(`course/${courseData.id}`, formData);
        courseData.navigateCoursePage && courseData.navigateCoursePage();
        return {
            topicId: courseData.topicIds,
            courseId: courseData.id,
            userId: courseData.userId,
            userUpdate: courseData.userId,
        };
    },
);

export const updateCourseAddUserTopic = createAsyncThunk(
    'course/add/user/topic',
    async (
        courseData: CourseData & {
            action?: string;
            adminId?: string;
        },
    ) => {
        const data = {
            userIds: courseData.userIds,
            action: courseData.action,
            topicIds: courseData.topicIds,
        };
        await axios.put(`course/${courseData.id}`, data);
        const res = {
            topicId: courseData.topicIds,
            courseId: courseData.id,
            userId: courseData.userIds,
            userUpdate: Boolean(courseData.adminId),
        };
        return res;
    },
);

export const deleteCourse = createAsyncThunk('course/delete', async (id: string) => {
    const {
        data: { data },
    } = await axios.delete(`course/${id}`);
    return {
        data,
    };
});
