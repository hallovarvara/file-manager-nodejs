import { readdir } from 'fs';
import { throwError } from './utils/throw-error.js';
import { write } from './utils/write.js';

export const getDirectoryContentList = async (path) => {
    await readdir(path, (readdirErr, files) => {
        if (readdirErr) {
            throwError({ isOperationFailed: true, error: readdirErr });
            return;
        }

        write(
            files?.length > 0
                ? `File list in "${path}"\n\n${files.join('\n')}`
                : `No files in "${path}" folder`,
        );
    });
};
