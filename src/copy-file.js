import { copyFile as copy, existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { throwError } from './utils/throw-error.js';
import { isString } from './utils/is-string.js';
import { write } from './utils/write.js';

export const copyFile = async ({
    currentPath = '',
    filename = '',
    newDirectoryName = '',
}) => {
    console.log({ filename, isAbs: isAbsolute(newDirectoryName) });

    const filePath = resolve(currentPath, filename);

    console.log({ filePath });

    const newDirectory = isAbsolute(newDirectoryName)
        ? newDirectoryName
        : resolve(currentPath, newDirectoryName);

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
                    'Incorrect directory name passed. Pass correct directory name',
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

    copy(filePath, newFilePath, (copyErr) => {
        if (copyErr) {
            throwError({ isOperationFailed: true, error: copyErr });
            return;
        }

        write(
            `File "${filename}" was successfully copied to "${newDirectory}" folder`,
        );
    });
};
