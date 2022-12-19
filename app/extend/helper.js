const moment = require('moment');

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg,
  };
  ctx.status = 200;
};
// 处理自定义响应
exports.erroMsg = ({ ctx, msg = '请求失败' }) => {
  ctx.body = {
    code: 500,
    data: null,
    msg,
  };
};
// 获取token信息
exports.jwtInfo = async ({ ctx, app }) => {
  const token = ctx.request.header.authorization;
  // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
  const decode = await app.jwt.verify(token, app.config.jwt.secret);
  if (!decode) {
    return;
  }
  return decode;
};
