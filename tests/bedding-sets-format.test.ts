import chalk from "chalk";
import { positiveBeddingSetFormat } from '../src/app/console/presenter/table-report.js';


describe('bedding-sets-format', () => {
    test('positiveBeddingSetFormat', () => {
        positiveBeddingSetFormat(5,chalk.greenBright);
    })
})