import { existsSync, rename } from 'fs';
import { resolve } from 'path';
import { throwError } from './utils/throw-error.js';
import { write } from './utils/write.js';

export const renameFile = async ({ directory, filename, newFilename }) => {
    if (!directory) {
        throwError({
            isOperationFailed: true,
            error: {
                message:
                    'No "directory" argument passed, please try to restart file-manager',
            },
        });
        return;
    }

    if (!filename || !newFilename) {
        throwError({
            isOperationFailed: true,
            error: {
                message:
                    'Please, pass "filename" and "newFilename" in command in this format:\nrn filename newFilename',
            },
        });
        return;
    }

    const filePath = resolve(directory, filename);

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `Nothing to rename. File "${filename}" doesn't exist in "${directory}" directory`,
            },
        });
        return;
    }

    const newFilePath = resolve(directory, newFilename);

    if (existsSync(newFilePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `Pass another new filename. File "${newFilename}" already exists in "${directory}" directory`,
            },
        });
        return;
    }

    rename(filePath, newFilePath, (renameErr) => {
        if (renameErr) {
            throwError({
                isOperationFailed: true,
                error: renameErr,
            });
            return;
        }

        write(
            `File "${filename}" was successfully renamed to "${newFilename}"`,
        );
    });
};
