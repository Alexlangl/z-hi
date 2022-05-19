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
const WebpackDllConfig = require('./webpack.dll').WebpackDllConfig;

// dll的方式
// const dllKey: string[] = Object.keys(WebpackDllConfig.entry);
// const dllPluginsAry: any[] = [];
// const AddAssetHtmlPluginAry: any[] = [];
// for (let index = 0; index < dllKey.length; index++) {
//   const key = dllKey[index];
//   AddAssetHtmlPluginAry.push({
//     filepath: path.resolve(__dirname, `./dll/${key}.js`),
//     publicPath: './dll',
//     outputPath: 'dll',
//   });
//   dllPluginsAry.push(
//     new DllReferencePlugin({
//       manifest: require(path.join(__dirname, './dll/', `${key}.manifest.json`)),
//     })
//   );
// }

const config: Configuration = merge(ConfigInit('production'), {
  plugins: [
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
    // ...dllPluginsAry,
    // new AddAssetHtmlPlugin(AddAssetHtmlPluginAry),
  ],
  optimization: {
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
    runtimeChunk: {
      name: 'manifest',
    },
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 4000000,
  },
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
