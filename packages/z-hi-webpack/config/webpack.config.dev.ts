const path = require('path');
import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { webpackArgsType } from '.';
import { ConfigInit } from './webpack.config.base';

export const devConfig = ({
  entry,
  outPath,
  putlickPath,
  templatePath,
  modulesPath,
}: Partial<webpackArgsType>): Configuration =>
  merge(
    ConfigInit({
      mode: 'development',
      entry,
      outPath,
      putlickPath,
      templatePath,
      modulesPath,
    }),
    {
      stats: 'errors-only',
    }
  );
export const baseServer = {
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
};

/** start dev */
const devServe = new WebpackDevServer(baseServer, webpack(devConfig({})));
devServe.start();
