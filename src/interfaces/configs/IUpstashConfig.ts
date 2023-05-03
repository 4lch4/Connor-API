export interface IUpstashConfig {
  /** The API token for access to the Upstash Redis instance. */
  restToken: string

  /** The Rest URL to the Upstash Redis instance. */
  restUrl: string

  /** The URL to the Upstash Redis instance. */
  url: string
}
