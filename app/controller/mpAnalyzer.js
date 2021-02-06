'use strict'

const Controller = require('egg').Controller

class mpAnalyzerController extends Controller {
  // 分析提交小程序包，生成报告
  async analyze () {
    const { ctx, app } = this
    const { mysql } = app
    const { mpAnalyzer } = ctx.service

    const { id } = ctx.session.userInfo

    const file = ctx.request.files[0]
    try {
      const fileArchive = await mpAnalyzer.saveFile(file)
      const mpDir = await mpAnalyzer.unarchive(fileArchive)
      const { report, reportDir } = await mpAnalyzer.analyze(mpDir)

      await mysql.insert('code_analysis', {
        user_id: id,
        miniprogram_path: fileArchive,
        report_path: reportDir
      })

      ctx.body = {
        successFlag: 'Y',
        errorMsg: '上传成功！',
        data: report
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        successFlag: 'N',
        errorMsg: '上传失败！',
        error: err
      }
    }
  }

  // 返回用户小程序分析历史
  async history () {
    const { ctx, app } = this
    const { mysql } = app

    const { id } = ctx.session.userInfo

    const analysisList = await mysql.select('code_analysis', {
      where: {
        user_id: id
      }
    })

    ctx.body = {
      data: analysisList
    }
  }
}

module.exports = mpAnalyzerController
