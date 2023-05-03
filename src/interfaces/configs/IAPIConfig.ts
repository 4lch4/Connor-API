export interface IAPIConfig {
  /** The string to prepend before all routes (default: `/api/v1`). */
  prefix?: string

  /** The name of the API/App. */
  name: string

  /** The version of the API/App (default: `v0.0.0`). */
  version?: string

  /** The port to listen on (default: `5050`). */
  port?: number
}