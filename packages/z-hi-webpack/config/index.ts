import { ConfigInit } from './webpack.config.base';
import { baseServer, devConfig } from './webpack.config.dev';
import { prodConfig } from './webpack.config.prod';
import {
  Configuration,
  webpack,
  Compiler,
  MultiCompiler,
  EntryObject,
} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
type EntryStatic = string | EntryObject | string[];

export interface webpackArgsType {
  extendedBaseConfig: Configuration;
  extendeDevServer: Compiler | MultiCompiler | Configuration | undefined;
  mode: 'development' | 'production';
  entry:
    | string
    | (() => string | EntryObject | string[] | Promise<EntryStatic>)
    | EntryObject
    | string[];
  outPath: string;
  putlickPath: string;
  templatePath: string;
  modulesPath: string;
  startDll: boolean;
  dillPath: string;
  manifestPath: string;
  themeVars: any;
}
export const baseConfig = ({
  extendedBaseConfig = {},
  extendeDevServer = {},
  mode,
  entry,
  outPath,
  putlickPath,
  templatePath,
  modulesPath,
  startDll,
  dillPath,
  manifestPath,
  themeVars = {},
}: Partial<webpackArgsType>) => {
  const baseConfig = merge(
    ConfigInit({
      mode,
      entry,
      outPath,
      putlickPath,
      templatePath,
      modulesPath,
      themeVars,
    }),
    extendedBaseConfig
  );

  const baseDevConfig = merge(
    devConfig({
      entry,
      outPath,
      putlickPath,
      templatePath,
      modulesPath,
      themeVars,
    }),
    extendedBaseConfig
  );

  const devServe = new WebpackDevServer(
    {
      ...baseServer,
      ...extendeDevServer,
    },
    webpack(baseDevConfig)
  );

  const baseProdConfig = merge(
    prodConfig({
      entry,
      outPath,
      putlickPath,
      templatePath,
      startDll,
      dillPath,
      manifestPath,
      themeVars,
    }),
    extendedBaseConfig
  );
  const prodFunc = (err: any, state: any) => {
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
  };
  /** run prod */
  // webpack(baseProdConfig, prodFunc);

  return {
    baseConfig,
    baseDevConfig,
    baseProdConfig,
    devServe,
    prodFunc,
  };
};
