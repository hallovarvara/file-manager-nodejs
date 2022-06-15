import { write } from '../utils/write.js';
import { EOL } from 'os';

export const getEolInfo = () => {
    write(`Default system End-Of-Line: ${JSON.stringify(EOL)}`);
};
