import { printRoutes } from '@4lch4/koa-router-printer'
import { logger } from '@4lch4/logger'
import { IAppConfig } from '@interfaces/index.js'
import Router from '@koa/router'
import Koa from 'koa'
import { koaBody } from 'koa-body'
import Helmet from 'koa-helmet'

export class Server {
  private app: Koa

  public constructor(private config: IAppConfig) {
    this.app = new Koa()
  }

  /**
   * Begins listening on the port specified in the app config. If it
   * successfully starts, it will log a message to the console like so:
   *
   * `[Server#start]: @4lch4/hermes-api:v0.0.0 has come online!`
   *
   * @returns {Server} The instance of the Server class.
   */
  public start(): Server {
    const port = this.config.apiConfig.port || 8080
    logger.debug(`[Server#addMiddleware]: Starting server and listening on port ${port}...`)

    this.app.listen(port, () => {
      logger.debug(
        `[Server#start]: ${this.config.apiConfig.name}:v${this.config.apiConfig.version} has come online!`
      )
    })

    return this // For method chaining
  }

  /**
   * Adds the expected middleware to the server, such as koa-body and
   * koa-helmet.
   *
   * @returns {Server} The instance of the Server class.
   */
  public addMiddleware(): Server {
    logger.debug('[Server#addMiddleware]: Adding middleware to server...')

    this.app.use(koaBody())
    this.app.use(Helmet())
    this.app.use(async (ctx, next) => {
      // Verify the request has a valid API key (apiToken) in the header or query string.
      const apiToken = ctx.request.headers['api-token'] || ctx.request.query['apiToken']

      if (apiToken !== process.env.ADMIN_API_TOKEN) {
        logger.error('[Server#addMiddleware]: No API token found in request!')
        ctx.status = 401
        ctx.body = {
          status: 'error',
          message: 'No, or invalid, API token found in request!',
        }

        return
      }

      await next()
    })

    return this // For method chaining
  }

  /**
   * Iterates over each of the routes provided and registers them with the
   * server. Once all routes have been registered, it will print the routes
   * to the console using the [@4lch4/koa-router-printer][0] package.
   *
   * [0]: https://www.npmjs.com/package/@4lch4/koa-router-printer
   *
   * @param routes The routes (an array of type {@link Router}) to register with the server.
   *
   * @returns {Server} The instance of the Server class.
   */
  public addRoutes(routes: Router[]): Server {
    logger.debug(`[Server#addRoutes]: Adding ${routes.length} routes to server...`)

    for (const route of routes) {
      this.app.use(route.routes())
      this.app.use(route.allowedMethods())
    }

    printRoutes(this.app, {
      displayHead: false,
      displayPrefix: true,
    })

    return this // For method chaining
  }
}
