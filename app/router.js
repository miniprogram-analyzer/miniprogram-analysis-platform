'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  const authMiddleware = middleware.auth()

  router.get('/api/test', controller.home.index)
  router.post('/api/login', controller.home.login)
  router.post('/api/register', controller.home.register)
  router.post('/api/getList', controller.home.get_list)
  router.post('/api/updateList', controller.home.update_list)
  router.post('/api/uploadFile', controller.home.upload_file)
  router.post('/api/submitQue', controller.home.submit_que)
  router.post('/api/getUserinfo', authMiddleware, controller.home.get_user_info)
  router.post('/api/loginOut', controller.home.log_out)
  router.post('/api/getLikestatus', controller.home.get_like_status)
  router.post('/api/getLikenum', controller.home.get_like_num)
  router.post('/api/like', controller.home.like)
  router.post('/api/modifyUserinfo', controller.home.modify_user_info)
  router.post('/api/getReplyorComment', controller.home.get_reply_or_comment)
  router.post('/api/submitComment', controller.home.submit_comment)
  router.post('/api/submitReply', controller.home.submit_reply)
  router.post('/api/getUserinteract', controller.home.get_user_interact)
  router.post('/api/submitFeedback', controller.home.submit_feedback)
  router.post('/api/printList', controller.home.print_list)
  router.post('/api/uploadPicture', controller.home.upload_picture)
}
