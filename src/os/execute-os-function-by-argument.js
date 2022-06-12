import { getEolInfo } from './get-eol-info.js';
import { getCpusInfo } from './get-cpus-info.js';
import { getHomeDirectory } from './get-home-directory.js';
import { getSystemUsername } from './get-system-username.js';
import { throwError } from '../utils/throw-error.js';
import { getSystemArchitecture } from './get-system-architecture.js';

export const executeOsFunctionByArgument = (arg) => {
    switch (arg) {
        case '--EOL':
            getEolInfo();
            break;
        case '--cpus':
            getCpusInfo();
            break;
        case '--homedir':
            getHomeDirectory();
            break;
        case '--username':
            getSystemUsername();
            break;
        case '--architecture':
            getSystemArchitecture();
            break;
        default:
            throwError({ isInputInvalid: true });
    }
};
