import { BaseUtil } from '@bases/BaseUtil.js'
import { IPocketbaseConfig } from '@interfaces/index.js'
import Pocketbase from 'pocketbase'

export class PocketbaseUtil extends BaseUtil {
  private client: Pocketbase

  constructor({ url }: IPocketbaseConfig) {
    super()

    this.client = new Pocketbase(url)
  }

  public async adminAuth(username: string, password: string): Promise<string> {
    try {
      const authRes = await this.client.admins.authWithPassword(username, password)

      return authRes.token
    } catch (error) {
      this.logger.error(`[PocketbaseUtil#adminAuth] Error authenticating admin: ${username}`)
      this.logger.error(error)

      throw error
    }
  }

  /**
   *
   * @param username The username to authenticate with.
   * @param password The password to authenticate with.
   *
   * @returns The auth token for the user.
   */
  public async userAuth(username: string, password: string): Promise<string> {
    try {
      const authRes = await this.client.collection('users').authWithPassword(username, password)

      return authRes.token
    } catch (error) {
      this.logger.error(`[PocketbaseUtil#userAuth] Error authenticating user: ${username}`)
      this.logger.error(error)

      throw error
    }
  }
}
