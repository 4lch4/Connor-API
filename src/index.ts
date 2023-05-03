import { logger } from '@4lch4/logger'
import { Server, ConfigUtil  } from '@lib/index.js'
import { getRoutes } from '@routes/index.js'

const init = async () => {
  try {
    // Get the application configuration.
    const config = ConfigUtil.getAppConfig()

    // Create a new server instance.
    const server = new Server(config)

    // Get the routes to add to the server.
    const routes = await getRoutes(config)

    // Add middleware, routes, and then return the result of the start() method.
    return server.addMiddleware().addRoutes(routes).start()
  } catch (error) {
    throw error
  }
}

init()
  .then(() => {
    logger.success('[index#init:then]: Server has successfully come online!')
  })
  .catch(err => {
    logger.error('[index#init:catch]: main() failed!')
    logger.error(err)
  })
