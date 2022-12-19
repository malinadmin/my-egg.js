'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.UserCreateTransfer = {
      username: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
    };
  }
  // 注册
  async register() {
    const { ctx } = this;

    // 效验参数
    ctx.validate(this.UserCreateTransfer);

    // 组装参数
    const payload = ctx.request.body || {};

    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUserInfo(payload.username); // 获取用户信息

    // 判断是否已经存在
    if (userInfo && userInfo.id) {
      const msg = '该账号已注册';
      ctx.helper.erroMsg({ ctx, msg });
      return;
    }

    // 调用 service 方法，将数据存入数据库。
    const res = await ctx.service.user.register(payload);
    this.getUserInfo();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 登录
  async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserInfo(username);

    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      const msg = '账号不存在';
      ctx.helper.erroMsg({ ctx, msg });
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (userInfo && password !== userInfo.password) {
      const msg = '账号密码错误';
      ctx.helper.erroMsg({ ctx, msg });
      return;
    }

    // 生成 token 加验
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
    const res = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // token 有效期为 24 小时
    }, app.config.jwt.secret);

    ctx.helper.success({ ctx, res });

  }

  // 验证方法
  async test() {
    const { ctx, app } = this;
    const res = await ctx.helper.jwtInfo({ ctx, app });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const decode = await ctx.helper.jwtInfo({ ctx, app });
    // 调用 Service 进行业务处理
    const res = await ctx.service.user.getUserInfo(decode.username);

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过 post 请求，在请求体中获取签名字段 signature
    const { signature = '' } = ctx.request.body;
    const decode = await ctx.helper.jwtInfo({ ctx, app });
    // 调用 Service 进行业务处理
    const res = await ctx.service.user.getUserInfo(decode.username);

    // 通过 service 方法 editUserInfo 修改 signature 信息。
    await ctx.service.user.editUserInfo(({
      ...res,
      signature,
    }));
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = UserController;
