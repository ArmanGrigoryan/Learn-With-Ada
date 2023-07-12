import { File } from 'formidable';

export interface IFile extends File {
    name: string;
    path: string;
    size: number;
    extension: string;
    type: string;
    content: ArrayBuffer;
}
