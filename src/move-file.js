import { copyFile as copy, existsSync, unlink } from 'fs';
import { resolve } from 'path';
import { throwError } from './utils/throw-error.js';
import { isString } from './utils/is-string.js';
import { write } from './utils/write.js';

export const moveFile = async ({
    currentPath,
    filename = '',
    newDirectoryName = '',
}) => {
    const filePath = resolve(currentPath, filename);
    const newDirectory = resolve(currentPath, newDirectoryName);

    if (!isString(filePath)) {
        throwError({
            isOperationFailed: true,
            error: { message: 'Pass correct file path' },
        });
        return;
    }
    if (!isString(newDirectory) || !existsSync(newDirectory)) {
        throwError({
            isOperationFailed: true,
            error: {
                message:
                    'Incorrect directory path passed. Pass correct directory path',
            },
        });
        return;
    }

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `No file "${filename}" found by passed file path "${filePath}"`,
            },
        });
        return;
    }

    const newFilePath = resolve(newDirectory, filename);

    if (existsSync(newFilePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `File "${filename}" already exists in directory "${newDirectory}"`,
            },
        });
        return;
    }

    await copy(filePath, newFilePath, (copyErr) => {
        if (copyErr) {
            throwError({ isOperationFailed: true, error: copyErr });
        }
    });

    await unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
            throwError({ isOperationFailed: true, error: unlinkErr });
            return;
        }

        write(
            `File "${filename}" was successfully moved to "${newDirectory}" folder`,
        );
    });
};
