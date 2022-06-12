import { pipeline } from 'stream';
import { write } from './utils/write.js';
import { STOP_COMMAND, HOME_DIRECTORY } from './constants.js';
import { welcomeUser } from './welcome.js';
import { throwError } from './utils/throw-error.js';
import { executeCommandStream } from './execute-command-stream.js';

export const initFileManager = async () => {
    const readable = process.stdin;
    const writable = process.stdin;

    welcomeUser();

    write(`
Just type any command in console, press Enter, and operation would be completed
Your current path is "${HOME_DIRECTORY}"
If you would like to exit, press "Ctrl/Cmd + C" or type "${STOP_COMMAND}" on a new line and press Enter
    `);

    // todo: write commands' list

    pipeline(readable, executeCommandStream, writable, (error) => {
        throwError({ error });
    });
};
