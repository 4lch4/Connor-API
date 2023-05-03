import { logger, Logger } from '@4lch4/logger'
import Router, { RouterContext } from '@koa/router'
import { IAppConfig } from '@interfaces/index.js'

/**
 * This class is the base class for all of my Route classes. It provides a
 * common interface for all of them to extend.
 *
 * @class BaseRoute
 */
export class BaseRoute {
  protected logger: Logger = logger
  protected router: Router

  constructor(protected config: IAppConfig) {
    this.router = new Router({ prefix: config.apiConfig.prefix })
  }

  /**
   * Verifies the provided {@link RouterContext ctx} request object contains a
   * valid API token either in the request body, query string, or as a header.
   *
   * @param ctx The Koa Router Context for the request.
   *
   * @returns Whether or not the request has an API token that is valid.
   */
  // protected authenticateRequest(ctx: RouterContext): boolean {
  //   return (
  //     ctx.request.body.apiToken === this.config.apiAdminToken ||
  //     ctx.request.query.apiToken === this.config.apiAdminToken ||
  //     ctx.request.headers.apiToken === this.config.apiAdminToken
  //   )
  // }

  async build(): Promise<Router> {
    return this.router
  }
}
