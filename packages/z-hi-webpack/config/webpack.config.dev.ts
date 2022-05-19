const path = require('path');
import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { ConfigInit } from './webpack.config.base';

const config: Configuration = ConfigInit('development');

const devserver = new WebpackDevServer(
  {
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    host: '127.0.0.1',
    port: '8081',
    open: true,
    setupExitSignals: true,
    compress: true,
  },
  webpack(config)
);
devserver.start();
