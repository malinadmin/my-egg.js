'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/', controller.home.index);
  router.get('/user', controller.home.user);
  router.post('/add', controller.home.add);
  router.post('/add_user', controller.home.addUser);
  router.post('/edit_user', controller.home.editUser);
  router.post('/delete_user', controller.home.deleteUser);
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串
  // 业务
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo); // 获取用户信息new
  router.get('/api/user/test', _jwt, controller.user.test);
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo); // 修改用户个性签名
  router.post('/api/upload', _jwt, controller.upload.upload); // 测试用户上传
  router.post('/api/bill/add', _jwt, controller.bill.add); // 添加账单
  router.get('/api/bill/list', _jwt, controller.bill.list); // 获取账单列表
  router.get('/api/bill/detail', _jwt, controller.bill.detail); // 获取详情
  router.post('/api/bill/update', _jwt, controller.bill.update); // 账单更新
  router.post('/api/bill/delete', _jwt, controller.bill.delete); // 删除账单
  router.get('/api/type/list', _jwt, controller.type.list); // 获取消费类型列表
  router.post('/api/type/list', _jwt, controller.type.add); // 新增消费类型列表
};
