'use strict';
const Service = require('egg').Service;

class UserService extends Service {

  // 通过用户名获取用户信息
  async getUserInfo(username) {
    const { ctx, app } = this;
    const result = await app.mysql.get('user', { username });
    if (!username) {
      ctx.throw(404, 'user not found');
    }
    return result;
  }

  // 注册
  async register(params) {
    const { app } = this;
    const result = await app.mysql.insert('user', { ...params, ctime: Date.now(), updata_time: Date.now(), avatar: 111 });
    return result;
  }

  // 修改用户信息
  async editUserInfo(params) {
    const { app } = this;
    // 通过 app.mysql.update 方法，指定 user 表，
    const result = await app.mysql.update('user', {
      ...params, // 要修改的参数体，直接通过 ... 扩展操作符展开
    }, {
      id: params.id, // 筛选出 id 等于 params.id 的用户
    });
    return result;
  }
}

module.exports = UserService;
