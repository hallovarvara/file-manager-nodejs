import { write } from '../utils/write.js';
import { userInfo } from 'os';

export const getSystemUsername = () => {
    write(`Your system username is "${userInfo().username}"`);
};
