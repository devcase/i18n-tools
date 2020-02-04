import webpack from 'webpack';
import config from './webpack.config'
import memoryfs from 'memory-fs';

export default(options = {}) => {
  const compiler = webpack({...config, ...options});

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};