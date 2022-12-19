'use strict';

const Service = require('egg').Service;

class BillService extends Service {

  async add(params) {
    const { app } = this;
    // 往 bill 表中，插入一条账单数据
    const result = await app.mysql.insert('bill', params);
    return result;
  }

  // 获取账单列表
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    const result = await app.mysql.query(sql);
    return result;
  }

  // 获取账单详情
  async detail(id, user_id) {
    const { app } = this;
    const result = await app.mysql.get('bill', { id, user_id });
    return result;
  }

  // 更新账单
  async update(params) {
    const { app } = this;
    const result = await app.mysql.update('bill', {
      ...params,
    }, {
      id: params.id,
      user_id: params.user_id,
    });
    return result;
  }

  // 删除账单
  async delete(id, user_id) {
    const { app } = this;
    const result = await app.mysql.delete('bill', {
      id,
      user_id,
    });
    return result;
  }

}


module.exports = BillService;
