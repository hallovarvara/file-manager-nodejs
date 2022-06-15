import { write } from '../utils/write.js';
import { HOME_DIRECTORY } from '../constants.js';

export const getHomeDirectory = () => {
    write(`Your computer's home directory is "${HOME_DIRECTORY}"`);
};
