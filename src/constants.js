import { homedir } from 'os';
import { arch } from 'os';

export const STOP_COMMAND = '.exit';
export const HOME_DIRECTORY = homedir();
export const UNKNOWN_USERNAME = 'unforgettable Unknown';

export const IS_MAC_OS = arch() === 'arm64';
