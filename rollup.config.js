import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import { spawn } from 'child_process';
import { obfuscator } from 'rollup-obfuscator';
import { string } from 'rollup-plugin-string'
import svgo from 'rollup-plugin-svgo';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

export default {
    input: 'src/app/app.js',
    output: {
        sourcemap: true,
        stringArray: false,
        format: 'iife',
        name: 'anideskMain',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: !production
            },
            onwarn: (warning, handler) => {
                if (warning.code.startsWith("a11y-")) return;
                handler(warning);
            }
        }),
        svgo(),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        string({
            include: 'src/icons/*.svg',
          }),
        css({ output: 'bundle.css' }),
        commonjs(),
        !production && serve(),
        !production && livereload('public'),
        production && obfuscator(),
        production && terser(),
        
    ],
    watch: {
        clearScreen: false
    }
};