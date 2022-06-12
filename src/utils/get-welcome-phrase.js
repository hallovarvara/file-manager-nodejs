import { isString } from './is-string.js';

export const getWelcomePhrase = (username = '') =>
    `Welcome to the File Manager, ${
        isString(username) ? username.trim() : 'unforgettable'
    }!`;
