import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

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
        'rxjs/operators',
        'rxjs/observable/fromEvent'
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            clean: true,
            exclude: ['tests/*.ts', '__tests__/*.ts', 'temp/*.ts', 'examples/**/*.js', 'examples/**/*.ts']
        }),
    ],
}