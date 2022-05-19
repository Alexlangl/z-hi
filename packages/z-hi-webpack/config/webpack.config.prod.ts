const path = require('path');
import webpack, { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import { ConfigInit } from './webpack.config.base';

const config: Configuration = merge(ConfigInit('production'), {
  plugins: [new CleanWebpackPlugin()],
});

webpack(config, (err: any, state: any) => {
  if (err) {
    console.log(err.stack || err);
  } else if (state.hasErrors()) {
    let err = '';
    state
      .toString({
        chunks: false,
        colors: true,
      })
      .split(/\r?\n/)
      .forEach((line: any) => {
        err += `    ${line}\n`;
      });
    console.warn(err);
  } else {
    console.log(
      state.toString({
        chunks: false,
        colors: true,
      })
    );
  }
});
