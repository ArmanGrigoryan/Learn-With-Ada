import { IFile } from '../core/models/fileModel';
import {
    timeForOneInstruction,
    uploadedFileSizeLimit,
    allowedFileExtensions,
} from './constant';

export function generateUniqueSuffix(): string {
    return Date.now() + '-' + Math.round(Math.random() * 1e9);
}

export const getLessonPassingTime = (assessmentQuestions: string[]): number => {
    return assessmentQuestions.length * timeForOneInstruction;
};

export const getFileExtention = (fileName: string): string => {
    const ext = /(?:\/([^/]+))?$/.exec(fileName)[1];
    return ext?.toLowerCase();
};

export const fileSizeValidator = (
    file: IFile,
): { message: string; error: boolean } | null => {
    return file.size / 1024 > uploadedFileSizeLimit * 1024
        ? { message: 'File size Error', error: true }
        : null;
};

export const fileTypeValidator = (
    file: IFile,
): { message: string; error: boolean } | null => {
    const fileExt = getFileExtention(file.type);
    if (!fileExt) return { message: 'File type Error', error: true };
    const isMatch = allowedFileExtensions.some((extension) =>
        extension.test(fileExt),
    );
    return !isMatch ? { message: 'File type Error', error: true } : null;
};
