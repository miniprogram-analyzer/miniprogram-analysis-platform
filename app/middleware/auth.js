'use strict';

module.exports = (options, app) => {

  // 根据 session auth 判断用户登录状态，未登录用户禁止敏感操作
  return async function auth(ctx, next) {
    const auth = ctx.session.auth;
    if (!auth) {
      ctx.status = 401;
      return;
    }
    await next();
  };
};
