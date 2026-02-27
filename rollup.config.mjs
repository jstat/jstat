import terser from '@rollup/plugin-terser';

export default [
  // UMD (backwards compatible, replaces current dist/jstat.js)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jstat.js',
      format: 'umd',
      name: 'jStat',
      exports: 'default',
      sourcemap: true
    }
  },
  // UMD minified (replaces current dist/jstat.min.js)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jstat.min.js',
      format: 'umd',
      name: 'jStat',
      exports: 'default',
      sourcemap: true,
      plugins: [terser()]
    }
  },
  // ESM (new)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jstat.esm.mjs',
      format: 'es',
      sourcemap: true
    }
  },
  // CJS (new -- cleaner than UMD for Node.js consumers)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jstat.cjs.js',
      format: 'cjs',
      exports: 'default',
      sourcemap: true
    }
  }
];
