const fs = require('fs')
const Controller = require('egg').Controller

class UploaderController extends Controller {
  async uploadPicture2Discuss () {
    const { ctx } = this

    for (const file of ctx.request.files) {
      console.log('field: ' + file.fieldname)
      console.log('filename: ' + file.filename)
      console.log('encoding: ' + file.encoding)
      console.log('mime: ' + file.mime)
      console.log('tmp filepath: ' + file.filepath)

      const fileName = file.filename
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

      const name = await ctx.service.news.GenerateUuidJustRandom()
      const newpath = '../../picture/discuss' + '/' + name + '.' + fileExtension
      fs.copyFileSync(file.filepath, newpath)
      ctx.body = {
        success: true,
        errorMsg: '操作成功！',
        msg: newpath
      }
    }
  }

  async uploadPicture2Share () {
    const { ctx } = this

    for (const file of ctx.request.files) {
      const fileName = file.filename
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

      const name = await ctx.service.news.GenerateUuidJustRandom()
      const newpath = '../../picture/share' + '/' + name + '.' + fileExtension
      fs.copyFileSync(file.filepath, newpath)
      ctx.body = {
        success: true,
        errorMsg: '操作成功！',
        msg: newpath
      }
    }
  }

  async uploadPicture2Person () {
    const { ctx } = this
    const { id } = ctx.request.body
    for (const file of ctx.request.files) {
      const fileName = file.filename
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

      const name = await ctx.service.news.GenerateUuidJustRandom()
      const newpath = '../../picture/person' + '/' + name + '.' + fileExtension
      fs.copyFileSync(file.filepath, newpath)

      const row = {
        id,
        face: newpath
      }
      const result = await this.app.mysql.update('student_test', row)// 更新 student_test 表中的记录

      // 判断更新成功
      const updateSuccess = result.affectedRows === 1
      if (updateSuccess) {
        ctx.body = {
          successFlag: 'Y',
          errorMsg: '上传成功!'
        }
      } else {
        ctx.body = {
          successFlag: 'N',
          errorMsg: '上传失败!'
        }
      }
    }
  }

  async uploadPicture2Feedback () {
    const { ctx } = this
    const picAdd = []
    var i = 0
    for (const file of ctx.request.files) {
      const fileName = file.filename
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

      const name = await ctx.service.news.GenerateUuidJustRandom()
      const newpath = '../../picture/feedback' + '/' + name + '.' + fileExtension
      fs.copyFileSync(file.filepath, newpath)
      picAdd[i] = newpath
      i += 1
    }
    const mark = await ctx.service.news.GetLengthOfFeedback()

    const row = {
      picture: picAdd
    }
    const options = {
      where: {
        serial: mark
      }
    }
    const result = await this.app.mysql.update('feedback', row, options)// 更新 feedback 表中的记录

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1
    if (updateSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '上传成功!'
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '上传失败!'
      }
    }
  }

  async uploadFile2Test () {
    const { ctx } = this
    const { id } = ctx.request.body

    const file = await ctx.request.files[0]

    const fileName = file.filename
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

    const name = await ctx.service.news.GenerateUuidAddId(id)
    const newpath = '../../file/test' + '/' + name + '.' + fileExtension
    fs.copyFileSync(file.filepath, newpath)
    ctx.body = {
      success: true,
      errorMsg: '操作成功！',
      msg: newpath
    }
  }

  async uploadFile2Exam () {
    const { ctx } = this
    const { id } = ctx.request.body
    const file = await ctx.request.files[0]

    const fileName = file.filename
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

    const name = await ctx.service.news.GenerateUuidAddId(id)
    const newpath = '../../file/exam' + '/' + name + '.' + fileExtension
    fs.copyFileSync(file.filepath, newpath)

    const row = {
      id,
      exam: newpath
    }
    const result = await this.app.mysql.update('student_test', row)// 更新 student_test 表中的记录

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1
    if (updateSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '上传成功!'
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '上传失败!'
      }
    }
  }
}

module.exports = UploaderController
