import Router from '@koa/router'
import { IAppConfig } from '@interfaces/index.js'
import { HealthRoute } from './HealthRoute.js'
import { QueryRoute } from './QueryRoute.js'

const Endpoints = [HealthRoute, QueryRoute]

/**
 * Creates and returns an array of {@link Router} objects that are to be used
 * by the server.
 *
 * @returns An array of {@link Router} instances that represent the routes to add to the API.
 */
export async function getRoutes(config: IAppConfig): Promise<Router[]> {
  // Instantiate an array of routers.
  const routes: Router[] = []

  // Loop through the endpoints and instantiate them.
  for (const Endpoint of Endpoints) {
    const endpoint = new Endpoint(config)

    routes.push(await endpoint.build())
  }

  // Return the array of routers.
  return routes
}
