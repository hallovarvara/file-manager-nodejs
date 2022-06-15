import { isString } from './is-string.js';
import { UNKNOWN_USERNAME } from '../constants.js';

export const getPartingPhrase = (username = '') =>
    `\nThank you for using File Manager, ${
        isString(username) ? username.trim() : UNKNOWN_USERNAME
    }!`;
