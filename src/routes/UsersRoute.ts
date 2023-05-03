import { Successful } from '@4lch4/koa-oto'
import { BaseRoute } from '@bases/index.js'
import { RouterContext } from '@koa/router'
import { PocketbaseUtil } from '@utils/index.js'
import { z } from 'zod'

const InputSchema = z.object({
  username: z.string(),
  password: z.string(),
  admin: z
    .boolean({ description: 'Whether or not to login as an admin user.' })
    .optional()
    .default(false),
})

export class UsersRoute extends BaseRoute {
  private async login(ctx: RouterContext) {
    const input = InputSchema.parse(ctx.request.body || ctx.request.query)
    const pbUtil = new PocketbaseUtil(this.config.pocketbaseConfig)

    if (input.admin) return pbUtil.adminAuth(input.username, input.password)
    else return pbUtil.userAuth(input.username, input.password)
  }

  async getMethod(ctx: RouterContext) {
    const authToken = await this.login(ctx)

    Successful.ok(ctx, { authToken })

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  async postMethod(ctx: RouterContext) {
    const pbUtil = new PocketbaseUtil(this.config.pocketbaseConfig)
    await pbUtil.userAuth('', '')

    Successful.ok(ctx)

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  override async build() {
    this.router.get('/users', ctx => this.getMethod(ctx))
    this.router.post('/users', ctx => this.postMethod(ctx))

    return this.router
  }
}
