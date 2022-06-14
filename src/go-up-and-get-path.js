import { resolvePath } from './utils/resolve-path.js';
import { showCurrentPath } from './show-current-path.js';

export const goUpAndGetPath = (currentPath) => {
    const newPath = resolvePath(currentPath, '..');
    showCurrentPath(newPath);
    return newPath;
};
