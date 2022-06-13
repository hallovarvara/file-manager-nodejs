import { Transform } from 'stream';
import { isAbsolute, resolve } from 'path';
import { STOP_COMMAND, HOME_DIRECTORY } from './constants.js';
import { write } from './utils/write.js';
import { goUpAndGetPath } from './go-up-and-get-path.js';
import { getDirectoryContentList } from './get-directory-content-list.js';
import { resolvePath } from './utils/resolve-path.js';
import { readFileContent } from './read-file-content.js';
import { createFile } from './create-file.js';
import { renameFile } from './rename-file.js';
import { copyFile } from './copy-file.js';
import { getCommandAttributes } from './utils/get-command-attributes.js';
import { moveFile } from './move-file.js';
import { deleteFile } from './delete-file.js';
import { throwError } from './utils/throw-error.js';
import { executeOsFunctionByArgument } from './os/execute-os-function-by-argument.js';
import { calculateFileHash } from './calculate-file-hash.js';
import { compressFile } from './compress-file.js';
import { decompressFile } from './decompress-file.js';

let currentPath = HOME_DIRECTORY;

export const executeCommandStream = new Transform({
    async transform(chunk, encoding, callback) {
        const command = chunk.toString().trim();

        if (command === STOP_COMMAND) {
            write('Thanks for using file manager! Have a great day! 👌 ');
            process.exit();
        } else if (command === 'up') {
            currentPath = goUpAndGetPath(currentPath);
        } else if (command === 'ls') {
            await getDirectoryContentList(currentPath);
        } else if (command.startsWith('cd')) {
            const [, pathAddition] = getCommandAttributes(command);

            const newPath = isAbsolute(pathAddition)
                ? pathAddition
                : resolve(currentPath, pathAddition);

            if (currentPath === newPath) {
                write(
                    pathAddition === '..' || pathAddition === '../'
                        ? 'No way back, you are in root directory'
                        : 'Add correct folder name',
                );
            } else {
                currentPath = newPath;
                write(`Your current path is "${currentPath}"`);
            }
        } else if (command.startsWith('cat')) {
            const [, filename = ''] = getCommandAttributes(command);
            await readFileContent({ directory: currentPath, filename });
        } else if (command.startsWith('add')) {
            const [, filename = ''] = getCommandAttributes(command);
            await createFile({ directory: currentPath, filename });
        } else if (command.startsWith('rn')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            await renameFile({ directory: currentPath, filename, newFilename });
        } else if (command.startsWith('cp')) {
            const [, filename = '', newDirectoryName = ''] =
                getCommandAttributes(command);

            await copyFile({ filename, newDirectoryName });
        } else if (command.startsWith('mv')) {
            const [, filename = '', newDirectoryName = ''] =
                getCommandAttributes(command);

            await moveFile({ filename, newDirectoryName });
        } else if (command.startsWith('rm')) {
            const [, filename = ''] = getCommandAttributes(command);
            const filePath = resolve(currentPath, filename);

            await deleteFile(filePath);
        } else if (command.startsWith('os')) {
            const [, arg] = getCommandAttributes(command);
            executeOsFunctionByArgument(arg);
        } else if (command.startsWith('hash')) {
            const [, filename = ''] = getCommandAttributes(command);

            await calculateFileHash({ currentPath, filename });
        } else if (command.startsWith('compress')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            compressFile({ currentPath, filename, newFilename });
        } else if (command.startsWith('decompress')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            decompressFile({ currentPath, filename, newFilename });
        } else {
            throwError({ isInputInvalid: true });
        }

        callback();
    },
});
