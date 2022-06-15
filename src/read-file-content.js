import { existsSync, createReadStream } from 'fs';
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

    const readableStream = createReadStream(filePath);

    readableStream.on('error', function (readErr) {
        throwError({ isOperationFailed: true, error: readErr });
    });

    readableStream.on('data', (chunk) => {
        const fileContent = chunk.toString();
        write(fileContent);
    });
};
