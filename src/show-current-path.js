import { write } from './utils/write.js';

export const showCurrentPath = (currentPath) => {
    write(`You are currently in ${currentPath}`);
};
