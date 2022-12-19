'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async add() {
    const { ctx, app } = this;
    // 效验参数

    // 获取请求中携带的参数
    const { name, type } = ctx.request.body;
    // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
    if (!name || !type) {
      const msg = '参数错误';
      ctx.helper.erroMsg({ ctx, msg });
    }
    if (![ 1, 2 ].includes(type)) {
      // 1为支出 2为收入
      const msg = '参数错误';
      ctx.helper.erroMsg({ ctx, msg });
    }
    let user_id = '';
    const decode = await ctx.helper.jwtInfo({ ctx, app });
    user_id = decode.id;
    // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示。
    // 可以理解为，我登录 A 账户，那么所做的操作都得加上 A 账户的 id，后续获取的时候，就过滤出 A 账户 id 的账单信息。
    await ctx.service.type.add({
      name,
      type,
      user_id,
    });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }

  async list() {
    const { ctx, app } = this;

    // 通过 token 解析，拿到 user_id
    const decode = await ctx.helper.jwtInfo({ ctx, app });
    const user_id = decode.id;
    const res = await ctx.service.type.list(user_id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = TypeController;
