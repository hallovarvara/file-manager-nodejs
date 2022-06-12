import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { throwError } from './utils/throw-error.js';
import { write } from './utils/write.js';
import { isString } from './utils/is-string.js';

export const calculateFileHash = async ({ currentPath, filename }) => {
    if (!isString(filename)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `Pass correct filename after "hash" command`,
            },
        });
        return;
    }

    const filePath = resolve(currentPath, filename);

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `File "${filename}" doesn't exist in "${currentPath}" directory`,
            },
        });
        return;
    }

    try {
        const fileBuffer = readFileSync(filePath);
        const hashSum = createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');

        write(`Hex of "${filename}" file is "${hex}"`);
    } catch (readErr) {
        throwError({
            isOperationFailed: true,
            error: readErr,
        });
    }
};
