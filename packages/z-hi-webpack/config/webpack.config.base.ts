import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const WebpackBar = require('webpackbar');

import { getLoader } from './getLoader';
import { webpackArgsType } from './index';

export const ConfigInit = ({
  mode,
  entry,
  outPath,
  putlickPath,
  templatePath,
}: Partial<webpackArgsType>): Configuration => {
  const isEnv = mode === 'development';
  const {
    svgOrImgLoaders,
    ttfLoaders,
    cssLoaders,
    lessLoaders,
    tsFileLoaders,
  } = getLoader(isEnv);

  return {
    target: 'web',
    mode,
    entry: entry || path.resolve(__dirname, '../src/index.tsx'),
    output: {
      filename: isEnv ? '[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
      path: outPath || path.resolve(__dirname, '../dist'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isEnv ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      }),
      new HtmlWebpackPlugin({
        title: 'test fro webpack',
        filename: 'index.html',
        template: templatePath || path.resolve(__dirname, './index.ejs'),
        hash: true,
        cache: false,
        inject: true,
        minify: {
          removeComments: true,
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
        },
        nodeModules: path.resolve(__dirname, '../../node_modules'),
      }),
      new WebpackBar(),
    ],
    module: {
      rules: [
        ...svgOrImgLoaders,
        ...ttfLoaders,
        ...cssLoaders,
        ...lessLoaders,
        ...tsFileLoaders,
      ],
    },
    resolve: {
      extensions: ['.tsx', '.js', '.ts', '.less', '.css'],
    },
  };
};
