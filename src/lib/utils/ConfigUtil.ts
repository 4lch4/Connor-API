import { BaseUtil } from '@bases/BaseUtil.js'
import {
  IAIConfig,
  IAPIConfig,
  IAppConfig,
  IPocketbaseConfig,
  IUpstashConfig,
} from '@interfaces/index.js'

export class ConfigUtil extends BaseUtil {
  public static getAIConfig(): IAIConfig {
    return {
      openAIApiKey: process.env.OPENAI_API_KEY || 'Unknown',
      vectorStorePath: process.env.VECTOR_STORE_PATH || 'Unknown',
      openAIModelName: process.env.OPENAI_MODEL_NAME || 'Unknown',
      openAiTemperature: Number(process.env.OPENAI_TEMPERATURE) || 0,
      inputVariables: process.env.OPENAI_INPUT_VARIABLES?.split(',') || [
        'history',
        'context',
        'prompt',
      ],
    }
  }

  public static getAPIConfig(): IAPIConfig {
    return {
      name: process.env.API_NAME || 'Connor-API',
      port: Number(process.env.API_PORT) || 8080,
      prefix: process.env.API_PREFIX || '/api/v1',
      version: process.env.VERSION_TAG || '0.0.0',
    }
  }

  public static getPocketbaseConfig(): IPocketbaseConfig {
    return {
      url: process.env.POCKETBASE_URL || 'Unknown',
    }
  }

  public static getUpstashConfig(): IUpstashConfig {
    return {
      url: process.env.UPSTASH_REDIS_URL || 'Unknown',
      restToken: process.env.UPSTASH_REDIS_REST_TOKEN || 'Unknown',
      restUrl: process.env.UPSTASH_REDIS_REST_URL || 'Unknown',
    }
  }

  public static getAppConfig(): IAppConfig {
    return {
      apiConfig: this.getAPIConfig(),
      pocketbaseConfig: this.getPocketbaseConfig(),
      upstashConfig: this.getUpstashConfig(),
      aiConfig: this.getAIConfig(),
    }
  }
}
