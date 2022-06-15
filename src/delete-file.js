import { existsSync, unlink } from 'fs';
import { basename, resolve } from 'path';
import { throwError } from './utils/throw-error.js';
import { isString } from './utils/is-string.js';
import { write } from './utils/write.js';

export const deleteFile = async (filePath) => {
    if (!isString(filePath)) {
        throwError({
            isOperationFailed: true,
            error: { message: `Incorrect file path: "${filePath}"` },
        });
        return;
    }

    const filename = basename(filePath);

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `No file "${filename}" found by passed file path "${filePath}"`,
            },
        });
        return;
    }

    await unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
            throwError({ isOperationFailed: true, error: unlinkErr });
            return;
        }

        write(`File "${filename}" was successfully deleted`);
    });
};
