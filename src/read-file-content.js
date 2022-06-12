import { existsSync, readFile } from 'fs';
import { resolve } from 'path';
import { write } from './utils/write.js';
import { throwError } from './utils/throw-error.js';

export const readFileContent = async ({ filename, directory }) => {
    const filePath = resolve(directory, filename);

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: { message: `File doesn't exist` },
        });
        return;
    }

    readFile(filePath, { encoding: 'utf8' }, (readErr, fileContent) => {
        if (readErr) {
            throwError({ isOperationFailed: true, error: readErr });
            return;
        }

        write(fileContent);
    });
};
