import { arch, cpus } from 'os';
import { write } from '../utils/write.js';

export const getCpusInfo = () => {
    const CPUInfo = cpus();
    const coefficient = arch() === 'arm64' ? 10 : 1000;
    const generalInfoString = `Your computer has ${CPUInfo.length} CPUS:`;

    const fullInfo = CPUInfo.reduce((resultString, { model, speed }, index) => {
        return (
            resultString +
            `\n${index + 1}) Model "${model}", it's clock rate is ${
                speed / coefficient
            } GHZ`
        );
    }, generalInfoString);

    write(fullInfo);
};
