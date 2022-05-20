const path = require('path');
import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { ConfigInit } from './webpack.config.base';

const config: Configuration = merge(ConfigInit('development'), {
  stats: 'errors-only',
});

const devserver = new WebpackDevServer(
  {
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    host: 'localhost',
    port: '8080',
    open: true,
    setupExitSignals: true,
    compress: true,
    client: {
      overlay: true,
      progress: true,
    },
  },
  webpack(config)
);
devserver.start().finally(() => {});
