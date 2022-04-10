// Needed hackery to get __filename and __dirname in ES6 mode
// see: https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/joiner.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'joiner-universal.js',
    library: {
      name: 'joiner',
      type: 'umd',
      export: 'default',
    },
  },
};