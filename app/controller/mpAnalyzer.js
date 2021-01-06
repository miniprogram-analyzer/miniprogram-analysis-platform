'use strict'

const Controller = require('egg').Controller

class mpAnalyzerController extends Controller {
  async uploadFile () {
    const { ctx } = this
    const { mpAnalyzer } = ctx.service

    const file = ctx.request.files[0]
    try {
      const fileArchive = await mpAnalyzer.saveFile(file)
      const mpDir = await mpAnalyzer.unarchive(fileArchive)
      const report = await mpAnalyzer.analyze(mpDir)

      ctx.body = {
        successFlag: 'Y',
        errorMsg: '上传成功！',
        data: report
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        successFlag: 'N',
        errorMsg: '上传失败！'
      }
    }
  }
}

module.exports = mpAnalyzerController
