import { Successful } from '@4lch4/koa-oto'
import { BaseRoute } from '@bases/index.js'
import { IAppConfig } from '@interfaces/index.js'
import { RouterContext } from '@koa/router'
import { BrainUtil } from '@lib/index.js'
// import { AskInputSchema } from '@schemas/index.js'
import { KVUtil } from '@utils/index.js'
import { nanoid } from 'nanoid'

export interface IAskInput {
  history: string[]
  prompt: string
}

export class QueryRoute extends BaseRoute {
  private kvUtil: KVUtil

  constructor(config: IAppConfig) {
    super(config)

    this.kvUtil = new KVUtil(config.upstashConfig)
  }

  private async getHistory(conversationId?: string): Promise<string[]> {
    this.logger.debug(`[QueryRoute#getHistory]: conversationId = ${conversationId}`)

    try {
      if (conversationId) {
        const history = await this.kvUtil.get(conversationId)

        this.logger.debug(`[QueryRoute#getHistory]: history = ${history}`)

        // if (history) return history
        return history
      } else return []
    } catch (error) {
      this.logger.error(`[QueryRoute#getHistory]: Error getting history for conversationId: ${conversationId}`)
      this.logger.error(error)

      return []
    }
  }

  /** At some point, this will return the latest queries made and stored in MongoDB. */
  async getMethod(ctx: RouterContext) {
    Successful.ok(ctx)

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  async postMethod(ctx: RouterContext) {
    const bUtil = await BrainUtil.init()
    const history = await this.getHistory(ctx.request.body.conversationId)
    // const input = AskInputSchema.parse({ history, prompt: ctx.request.body.prompt })
    const input = { history, prompt: ctx.request.body.prompt }
    const conversationId = ctx.request.body.conversationId || nanoid(12)

    this.logger.debug(`[QueryRoute#postMethod]: history = ${history}`)
    this.logger.debug(`[QueryRoute#postMethod]: input = ${JSON.stringify(input, null, 2)}`)
    this.logger.debug(`[QueryRoute#postMethod]: conversationId = ${conversationId}`)

    const reply = await bUtil.ask(input)

    this.logger.debug(`[QueryRoute#postMethod]: reply = ${reply}`)

    history.push(`Human: ${input.prompt}`, `Connor: ${reply}`)

    this.logger.debug(`[QueryRoute#postMethod]: history = ${history}`)

    const saveRes = await this.kvUtil.set<string[]>(conversationId, history)

    this.logger.debug(`[QueryRoute#postMethod]: saveRes = ${saveRes}`)

    Successful.ok(ctx, { reply, conversationId })

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  override async build() {
    this.router.get('/query', ctx => this.getMethod(ctx))
    this.router.post('/query', ctx => this.postMethod(ctx))

    return this.router
  }
}
