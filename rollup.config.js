import autoExternal from 'rollup-plugin-auto-external';
import commonjs from 'rollup-plugin-commonjs';

import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
    input: 'src/Db.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        'rxjs',
        'rxjs/operators'
    ],
    plugins: [
        autoExternal(),
        commonjs(),
        typescript({
            typescript: require('typescript'),
            clean: true,
            exclude: ['tests/*.ts', '__tests__/*.ts', 'temp/*.ts', 'examples/**/*.js', 'examples/**/*.ts']
        }),
    ],
}