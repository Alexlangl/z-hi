const path = require('path');
import webpack, {
  Configuration,
  BannerPlugin,
  LoaderOptionsPlugin,
  DllReferencePlugin,
} from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import { ConfigInit } from './webpack.config.base';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import { webpackArgsType } from './index';
const WebpackDllConfig = require('./webpack.dll').WebpackDllConfig;

// dll的方式
const getDillArr = (dillPath?: string, manifestPath?: string) => {
  const dllKey: string[] = Object.keys(WebpackDllConfig.entry);
  const dllPluginsAry: any[] = [];
  const AddAssetHtmlPluginAry: any[] = [];
  for (let index = 0; index < dllKey.length; index++) {
    const key = dllKey[index];
    AddAssetHtmlPluginAry.push({
      filepath: dillPath || path.resolve(__dirname, `./dll/${key}.js`),
      publicPath: './dll',
      outputPath: 'dll',
    });
    dllPluginsAry.push(
      new DllReferencePlugin({
        manifest:
          manifestPath ||
          require(path.join(__dirname, './dll/', `${key}.manifest.json`)),
      })
    );
  }
  return { dllPluginsAry, AddAssetHtmlPluginAry };
};

const plugins: any[] = [
  new CleanWebpackPlugin(),
  // 预先准备的资源压缩版本
  new CompressionWebpackPlugin(),
  // copy static files
  // new CopyWebpackPlugin({
  //   patterns: [{ from: 'A', to: 'B' }]
  // }),
  // css 压缩
  new LoaderOptionsPlugin({
    minimize: true,
  }),
];

export const prodConfig = ({
  entry,
  outPath,
  putlickPath,
  templatePath,
  startDll,
  dillPath,
  manifestPath,
}: Partial<webpackArgsType>): Configuration => {
  if (startDll) {
    const { dllPluginsAry, AddAssetHtmlPluginAry } = getDillArr(
      dillPath,
      manifestPath
    );
    (dllPluginsAry || []).forEach((el) => {
      plugins.push(el);
    });
    plugins.push(new AddAssetHtmlPlugin(AddAssetHtmlPluginAry));
  }

  return merge(
    ConfigInit({
      mode: 'production',
      entry,
      outPath,
      putlickPath,
      templatePath,
    }),
    {
      devtool: false,
      plugins,
      optimization: {
        runtimeChunk: 'single',
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }),
          new CssMinimizerPlugin(),
        ],
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name(module: any) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];

                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              },
            },
            // 将所有的样式文件打包到单个项目
            styles: {
              test: /\.(css|less)$/,
              name: 'styles',
              enforce: true,
              chunks: 'all',
            },
          },
        },
        minimize: true,
      },
      performance: {
        hints: 'error',
        maxEntrypointSize: 4000000,
      },
    }
  );
};

webpack(prodConfig({}), (err: any, state: any) => {
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
