import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getLoader } from './getLoader';

export const ConfigInit = (
  mode: 'development' | 'production'
): Configuration => {
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
    entry: path.resolve(__dirname, '../src/index.tsx'),
    output: {
      filename: isEnv ? '[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
      path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isEnv ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      }),
      new HtmlWebpackPlugin({
        title: 'test fro webpack',
        filename: 'index.html',
        template: path.resolve(__dirname, './index.ejs'),
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
