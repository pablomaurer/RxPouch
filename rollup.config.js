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
        './examples',
        './tests',
        './__tests__'
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            exclude: ['tests/*.ts', 'examples/**/*.js', 'examples/**/*.ts']
        }),
    ],
}