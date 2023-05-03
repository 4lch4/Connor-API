import { Successful } from '@4lch4/koa-oto'
import { RouterContext } from '@koa/router'
import { BaseRoute } from '@bases/index.js'

export class AuthRoute extends BaseRoute {
  async getMethod(ctx: RouterContext) {
    Successful.ok(ctx)

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  async postMethod(ctx: RouterContext) {
    Successful.ok(ctx)

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  override async build() {
    this.router.get('/auth', ctx => this.getMethod(ctx))
    this.router.post('/auth', ctx => this.postMethod(ctx))

    return this.router
  }
}
