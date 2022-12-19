'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  // 新增标签
  async add(params) {
    const { app } = this;
    const result = await app.mysql.insert('type', params);
    return result;
  }
  // 获取标签列表
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, name, type, user_id';
    const sql = `select ${QUERY_STR} from type where user_id = 0 or user_id = ${id}`;
    const result = await app.mysql.query(sql);
    return result;
  }
}

module.exports = TypeService;
