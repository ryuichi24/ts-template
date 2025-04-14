export type CommonOptionsBase = {
  isGlobal?: boolean;
};

export type SyncRegisterOptionsBase<
  TServiceConfig,
  TCommonOptions extends CommonOptionsBase = CommonOptionsBase,
> = TCommonOptions & TServiceConfig;

export type AsyncRegisterOptionsBase<
  TServiceConfig,
  TCommonOptions extends CommonOptionsBase = CommonOptionsBase,
> = TCommonOptions & (AsyncRegisterWithFactory<TServiceConfig> | AsyncRegisterWithClass<TServiceConfig>);

type AsyncRegisterWithFactory<TConfig> = {
  useFactory: (...args: any[]) => Promise<TConfig> | TConfig;
  inject?: any[];
};

export interface CanBuildConfig<TServiceConfig> {
  buildConfig(): TServiceConfig | Promise<TServiceConfig>;
}

type AsyncRegisterWithClass<TServiceConfig> = {
  useClass: new (...args: any[]) => CanBuildConfig<TServiceConfig>;
};
