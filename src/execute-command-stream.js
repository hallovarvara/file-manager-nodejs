import { Transform } from 'stream';
import { isAbsolute, resolve } from 'path';
import { STOP_COMMAND, HOME_DIRECTORY, IS_MAC_OS } from './constants.js';
import { write } from './utils/write.js';
import { goUpAndGetPath } from './go-up-and-get-path.js';
import { getDirectoryContentList } from './get-directory-content-list.js';
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
import { exit } from './exit.js';
import { resolvePath } from './utils/resolve-path.js';
import { showCurrentPath } from './show-current-path.js';
import { help } from './help.js';

let currentPath = HOME_DIRECTORY;

export const executeCommandStream = new Transform({
    async transform(chunk, encoding, callback) {
        const command = chunk.toString().trim();

        if (command === STOP_COMMAND) {
            exit();
        } else if (command === 'help' || command === '.help') {
            help();
        } else if (command === 'up') {
            currentPath = goUpAndGetPath(currentPath);
        } else if (command === 'ls') {
            await getDirectoryContentList(currentPath);
        } else if (command.startsWith('cd')) {
            const [, pathAddition] = getCommandAttributes(command);

            const isWindowsDiskPassed =
                /^[a-zA-Z]:\\$/.test(pathAddition) && !IS_MAC_OS;

            const newPath = resolvePath(
                currentPath,
                pathAddition,
                isAbsolute(pathAddition) || isWindowsDiskPassed,
            );

            if (currentPath === newPath) {
                write(
                    pathAddition === '..' || pathAddition === '../'
                        ? 'No way back, you are in root directory'
                        : 'Type correct path after "cd" command',
                );
            } else {
                currentPath = newPath;
            }
            showCurrentPath(currentPath);
        } else if (command.startsWith('cat')) {
            const [, filename = ''] = getCommandAttributes(command);
            await readFileContent({ directory: currentPath, filename });

            showCurrentPath(currentPath);
        } else if (command.startsWith('add')) {
            const [, filename = ''] = getCommandAttributes(command);
            await createFile({ directory: currentPath, filename });

            showCurrentPath(currentPath);
        } else if (command.startsWith('rn')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            await renameFile({ directory: currentPath, filename, newFilename });

            showCurrentPath(currentPath);
        } else if (command.startsWith('cp')) {
            const [, filename = '', newDirectoryName = ''] =
                getCommandAttributes(command);

            await copyFile({ currentPath, filename, newDirectoryName });

            showCurrentPath(currentPath);
        } else if (command.startsWith('mv')) {
            const [, filename = '', newDirectoryName = ''] =
                getCommandAttributes(command);

            await moveFile({ currentPath, filename, newDirectoryName });

            showCurrentPath(currentPath);
        } else if (command.startsWith('rm')) {
            const [, filename = ''] = getCommandAttributes(command);
            const filePath = resolve(currentPath, filename);

            await deleteFile(filePath);

            showCurrentPath(currentPath);
        } else if (command.startsWith('os')) {
            const [, arg] = getCommandAttributes(command);

            executeOsFunctionByArgument(arg);
            showCurrentPath(currentPath);
        } else if (command.startsWith('hash')) {
            const [, filename = ''] = getCommandAttributes(command);

            await calculateFileHash({ currentPath, filename });
            showCurrentPath(currentPath);
        } else if (command.startsWith('compress')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            compressFile({ currentPath, filename, newFilename });
            showCurrentPath(currentPath);
        } else if (command.startsWith('decompress')) {
            const [, filename = '', newFilename = ''] =
                getCommandAttributes(command);

            decompressFile({ currentPath, filename, newFilename });
            showCurrentPath(currentPath);
        } else {
            throwError({ isInputInvalid: true });
            showCurrentPath(currentPath);
        }

        callback();
    },
});
