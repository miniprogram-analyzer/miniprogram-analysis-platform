'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/login', controller.home.login);
  router.post('/api/register', controller.home.register);
  router.post('/api/getList', controller.home.get_list);
  router.post('/api/updateList', controller.home.update_list);
  router.post('/api/uploadFile', controller.home.upload_file);
  router.post('/api/submitQue', controller.home.submit_que);
  router.post('/api/getUserinfo', controller.home.get_userinfo);
  router.post('/api/loginOut', controller.home.remove_cookie);
  router.post('/api/getLikestatus', controller.home.get_like_status);
  router.post('/api/getLikenum', controller.home.get_like_num);
  router.post('/api/like', controller.home.like);
};
