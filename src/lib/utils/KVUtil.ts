import { BaseUtil } from '@bases/index.js'
import { IUpstashConfig } from '@interfaces/index.js'
import { Redis } from '@upstash/redis'

export class KVUtil extends BaseUtil {
  private client: Redis

  public constructor(config: IUpstashConfig) {
    super()

    this.client = new Redis({ url: config.restUrl, token: config.restToken })
  }

  public async get<T = any>(key: string) {
    try {
      this.logger.debug(`[KVUtil#get] Getting key: ${key}`)
      const res = await this.client.get<T>(key)

      this.logger.debug(`[KVUtil#get] Got key: ${key} with value: ${JSON.stringify(res, null, 2)}`)

      return res
    } catch (error) {
      this.logger.error(`[KVUtil#get] Error getting key: ${key}`)
      this.logger.error(error)

      return null
    }
  }

  public async set<T = any>(key: string, value: T) {
    try {
      this.logger.debug(`[KVUtil#set] Setting key: ${key} to value: ${JSON.stringify(value, null, 2)}`)
      const res = await this.client.set<T>(key, value)

      return res
    } catch (error) {
      this.logger.error(`[KVUtil#set] Error setting key: ${key}`)
      this.logger.error(error)

      return null
    }
  }
}
