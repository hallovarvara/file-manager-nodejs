import { resolvePath } from './utils/resolve-path.js';
import { write } from './utils/write.js';

export const goUpAndGetPath = (currentPath) => {
    const newPath = resolvePath(currentPath, '..');
    write(`Your current path is "${newPath}"`);
    return newPath;
};
