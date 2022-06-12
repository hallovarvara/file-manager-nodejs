import { write } from '../utils/write.js';
import { arch } from 'os';

export const getSystemArchitecture = () => {
    write(`Your system architecture is "${arch()}"`);
};
