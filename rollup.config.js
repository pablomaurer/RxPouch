import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
    input: 'src/RxDb.ts',
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
        typescript({
            typescript: require('typescript'),
        }),
    ],
}