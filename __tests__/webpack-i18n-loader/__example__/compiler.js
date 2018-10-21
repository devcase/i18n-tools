import path from 'path';
import webpack from 'webpack';
import config from './webpack.config'
import memoryfs from 'memory-fs';

export default() => {
  const compiler = webpack(config);

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    console.log("compiling")
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};