'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  const authMiddleware = middleware.auth()

  let prefix = '/api'

  if (app.config.env === 'stage') {
    prefix = `/dev${prefix}`
  }

  router.get(`${prefix}/test`, controller.home.index)
  router.post(`${prefix}/login`, controller.home.login)
  router.post(`${prefix}/register`, controller.home.register)
  router.post(`${prefix}/getList`, controller.home.getList)
  router.post(`${prefix}/updateList`, controller.home.updateList)
  router.post(`${prefix}/analyzer/analyze`, authMiddleware, controller.mpAnalyzer.analyze)
  router.get(`${prefix}/analyzer/history`, authMiddleware, controller.mpAnalyzer.history)
  router.post(`${prefix}/submitQue`, controller.home.submitQue)
  router.post(`${prefix}/getUserinfo`, authMiddleware, controller.home.getUserInfo)
  router.post(`${prefix}/loginOut`, controller.home.logOut)
  router.post(`${prefix}/getLikestatus`, controller.home.getLikeStatus)
  router.post(`${prefix}/getLikenum`, controller.home.getLikeNum)
  router.post(`${prefix}/like`, controller.home.like)
  router.post(`${prefix}/modifyUserinfo`, controller.home.modifyUserInfo)
  router.post(`${prefix}/getReplyorComment`, controller.home.getReplyOrComment)
  router.post(`${prefix}/submitComment`, controller.home.submitComment)
  router.post(`${prefix}/submitReply`, controller.home.submitReply)
  router.post(`${prefix}/getUserinteract`, controller.home.getUserInteract)
  router.post(`${prefix}/submitFeedback`, controller.home.submitFeedback)
  router.post(`${prefix}/printList`, controller.home.printList)
  router.post(`${prefix}/uploadPictureToDiscuss`, controller.uploader.uploadPicture2Discuss)
  router.post(`${prefix}/uploadPictureToShare`, controller.uploader.uploadPicture2Share)
  router.post(`${prefix}/uploadPictureToPerson`, controller.uploader.uploadPicture2Person)
  router.post(`${prefix}/uploadPictureToFeedback`, controller.uploader.uploadPicture2Feedback)
  router.post(`${prefix}/printProblem`, controller.home.printProblem)
  router.post(`${prefix}/saveProblem`, controller.home.saveProblem)
  router.post(`${prefix}/submitDiscuss`, controller.home.submitDiscuss)
  router.post(`${prefix}/submitShare`, controller.home.submitShare)
  router.post(`${prefix}/getProblem`, controller.home.getProblem)
  router.post(`${prefix}/uploadFileForTest`, controller.uploader.uploadFile2Test)
  router.post(`${prefix}/uploadFileForExam`, controller.uploader.uploadFile2Exam)
  router.post(`${prefix}/printFeedback`, controller.home.printFeedback)
  router.post(`${prefix}/getListnum`, controller.home.getListNum)
}
