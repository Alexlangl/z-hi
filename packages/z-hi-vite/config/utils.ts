import {
  UserConfig,
  ConfigEnv,
  UserConfigExport,
  UserConfigFn,
  mergeConfig as viteMergeConfig,
} from 'vite';

export type Interceptor = (
  config: UserConfig,
  env: ConfigEnv
) => UserConfig | Promise<UserConfig> | undefined;

export const mergeConfig = (a: UserConfig, b: UserConfig) => {
  return viteMergeConfig(a, b);
};

export const tapConfig = (
  config: UserConfigExport,
  interceptor: Interceptor
): UserConfigFn => {
  return async function modifiedConfig(env: ConfigEnv) {
    const userConfig =
      (await (typeof config === 'function' ? config(env) : config)) || {};
    return interceptor(userConfig, env) ?? userConfig;
  };
};
