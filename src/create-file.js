import { existsSync, writeFile } from 'fs';
import { resolve } from 'path';
import { write } from './utils/write.js';
import { throwError } from './utils/throw-error.js';

export const createFile = async ({ directory, filename }) => {
    const filePath = resolve(directory, filename);
    if (existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `File "${filename}" already exists in "${directory}" directory`,
            },
        });
        return;
    }

    writeFile(filePath, '', (writeErr) => {
        if (writeErr) {
            throwError({ isOperationFailed: true, error: writeErr });
            return;
        }

        write(
            `File "${filename}" was successfully created in "${directory}" directory`,
        );
    });
};
