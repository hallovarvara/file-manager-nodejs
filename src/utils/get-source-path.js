import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export const getSourcePath = ({ url, folderName = '', fileName = '' }) => {
    const __filename = fileURLToPath(url);
    const __dirname = dirname(__filename);
    return join(__dirname, folderName, fileName);
};
