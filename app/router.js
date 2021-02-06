'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  const authMiddleware = middleware.auth()

  let prefix = '/api'

  console.log(app.config.env)

  if (app.config.env === 'stage') {
    prefix = `/dev${prefix}`
  }

  router.get(`${prefix}/test`, controller.home.index)
  router.post(`${prefix}/login`, controller.home.login)
  router.post(`${prefix}/register`, controller.home.register)
  router.post(`${prefix}/getList`, controller.home.get_list)
  router.post(`${prefix}/updateList`, controller.home.update_list)
  router.post(`${prefix}/uploadFile`, controller.mpAnalyzer.uploadFile)
  router.post(`${prefix}/submitQue`, controller.home.submit_que)
  router.post(`${prefix}/getUserinfo`, authMiddleware, controller.home.get_user_info)
  router.post(`${prefix}/loginOut`, controller.home.log_out)
  router.post(`${prefix}/getLikestatus`, controller.home.get_like_status)
  router.post(`${prefix}/getLikenum`, controller.home.get_like_num)
  router.post(`${prefix}/like`, controller.home.like)
  router.post(`${prefix}/modifyUserinfo`, controller.home.modify_user_info)
  router.post(`${prefix}/getReplyorComment`, controller.home.get_reply_or_comment)
  router.post(`${prefix}/submitComment`, controller.home.submit_comment)
  router.post(`${prefix}/submitReply`, controller.home.submit_reply)
  router.post(`${prefix}/getUserinteract`, controller.home.get_user_interact)
  router.post(`${prefix}/submitFeedback`, controller.home.submit_feedback)
  router.post(`${prefix}/printList`, controller.home.print_list)
  router.post(`${prefix}/uploadPictureToDiscuss`, controller.home.upload_picture_to_discuss)
  router.post(`${prefix}/uploadPictureToShare`, controller.home.upload_picture_to_share)
  router.post(`${prefix}/uploadPictureToPerson`, controller.home.upload_picture_to_person)
  router.post(`${prefix}/uploadPictureToFeedback`, controller.home.upload_picture_to_feedback)
  router.post(`${prefix}/printProblem`, controller.home.print_problem)
  router.post(`${prefix}/saveProblem`, controller.home.save_problem)
  router.post(`${prefix}/submitDiscuss`, controller.home.submit_discuss)
  router.post(`${prefix}/submitShare`, controller.home.submit_share)
  router.post(`${prefix}/getProblem`, controller.home.get_problem)
  router.post(`${prefix}/uploadFileForTest`, controller.home.upload_file_for_test)
  router.post(`${prefix}/uploadFileForExam`, controller.home.upload_file_for_exam)
  router.post(`${prefix}/printFeedback`, controller.home.print_feedback)
  router.post(`${prefix}/getListnum`, controller.home.get_list_num)
}
