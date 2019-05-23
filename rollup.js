const autoExternal = require('rollup-plugin-auto-external');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const typescript = require('rollup-plugin-typescript2');

const pkg = require('./package');
const rollup = require('rollup');

// Input
// --------------------------
const input = {
    input: 'src/Db.ts',
    external: [
        'rxjs',
        'rxjs/operators'
    ],
    plugins: [
        autoExternal(),
        commonjs(),
        json(),
        typescript({
            typescript: require('typescript'),
            clean: true,
            exclude: ['tests/*.ts', '__tests__/*.ts', 'temp/*.ts', 'examples/**/*.js', 'examples/**/*.ts']
        }),
    ],
};

// Output
// --------------------------
const output = {
    cjs: {
        file: pkg.main,
        format: 'cjs',
    },
    es: {
        file: pkg.module,
        format: 'es',
    }
};

// Build
// --------------------------
async function build() {
    const bundle = await rollup.rollup(input);

    for (let prop in output) {
        console.log("building: " + prop);
        await bundle.write(output[prop]);
    }

}

// Actually call build
// --------------------------
build();