import { createBrotliCompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { resolve, isAbsolute } from 'path';
import { existsSync } from 'fs';
import { throwError } from './utils/throw-error.js';
import { write } from './utils/write.js';
import { isString } from './utils/is-string.js';

export const compressFile = ({ currentPath, filename, newFilename }) => {
    if (!isString(filename) || !isString(newFilename)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `Pass a correct filenames after "compress" command`,
            },
        });
        return;
    }

    const filePath = resolve(currentPath, filename);

    const newFilePath = isAbsolute(newFilename)
        ? newFilename
        : resolve(currentPath, newFilename);

    if (!existsSync(filePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `Pass a correct filename for source file ("${filename}" doesn't exist)`,
            },
        });
        return;
    }

    if (existsSync(newFilePath)) {
        throwError({
            isOperationFailed: true,
            error: {
                message: `File "${newFilename}" already exists. Pass other filename for compressed file`,
            },
        });
        return;
    }

    const brotli = createBrotliCompress();
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(newFilePath);

    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        write(
            `File "${filename}" was successfully compressed to "${newFilename}"`,
        );
    });
};
