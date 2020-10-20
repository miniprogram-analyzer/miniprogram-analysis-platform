'use strict';

module.exports = (options, app) => {

  return async function forbidip(ctx, next) {

    // 要屏蔽的ip地址
    const forbidips = options.forbidips;

    // 获取客户端ip
    // console.log(forbidips);

    const clientip = ctx.request.ip;

    const hasip = forbidips.some(function(val) {

      if (val === clientip) {

        return true;
      }
      return false;

    });
    if (hasip) {
      ctx.status = 403;

      ctx.body = '您的ip已经被屏蔽';

    } else {
      await next();
    }
    // if (ctx.request.ip == forbidip) {


    // }

  };
};

