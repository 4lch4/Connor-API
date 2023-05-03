import { Successful } from '@4lch4/koa-oto'
import { RouterContext } from '@koa/router'
import { BaseRoute } from '@bases/index.js'

export class HealthRoute extends BaseRoute {
  async getMethod(ctx: RouterContext) {
    Successful.ok(ctx)

    this.logger.success(`${ctx.method} ⇥ ${ctx.path} ⇥ (${ctx.status})`)
  }

  override async build() {
    this.router.get('/health/liveness', ctx => this.getMethod(ctx))
    this.router.get('/health/readiness', ctx => this.getMethod(ctx))

    return this.router
  }
}
