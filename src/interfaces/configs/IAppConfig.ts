import { IAIConfig, IAPIConfig, IPocketbaseConfig, IUpstashConfig } from './index.js'

export interface IAppConfig {
  /** The object containing the config options for the Connor-API. */
  apiConfig: IAPIConfig

  /** The object containing the config options related to the AI component. */
  aiConfig: IAIConfig

  /** The object containing the config options for connecting to Pocketbase. */
  pocketbaseConfig: IPocketbaseConfig

  /** The object containing the config options for connecting to Upstash/Redis. */
  upstashConfig: IUpstashConfig
}
