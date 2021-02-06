'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index () {
    const { ctx } = this
    ctx.body = '你好, egg'
  }

  async login () {
    const ctx = this.ctx
    const { nameOrid, password } = ctx.request.body
    const VeriUser = await ctx.service.user.VeriUserByNaOrId(nameOrid, password)

    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '用户名不存在或者密码错误'
      }
      return
    }

    const userInfo = await ctx.service.user.getUserByNameOrId(nameOrid)

    // auth: boolean 判断用户登录状态
    ctx.session.auth = true
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '登录成功！',
      data: {
        userInfo
      }
    }
  }

  async register () {
    const ctx = this.ctx
    const { id, username, password } = ctx.request.body
    const VeriUser = await ctx.service.user.VeriUserById(id)
    const VeriRep = await ctx.service.user.VeriRepByNa(username)

    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '学号错误或者学号已注册！'
      }
    } else {
      if (!VeriRep) {
        ctx.body = {
          successFlag: 'Y',
          errorMsg: '注册成功,请登录！'
        }
        const row = {
          id,
          username,
          password
        }
        const result = await this.app.mysql.update('student_test', row)// 更新 student_test 表中的记录

        // 判断更新成功
        const updateSuccess = result.affectedRows === 1
        if (updateSuccess) {
          console.log('用户注册成功')
        }

        ctx.session.auth = true
      } else {
        ctx.body = {
          successFlag: 'N',
          errorMsg: '该用户名已被注册！'
        }
      }
    }
  }

  async logOut () {
    const { ctx } = this
    ctx.session = null
    ctx.status = 204
  }

  async getList () {
    const { ctx } = this
    let { option, isentire, serial, size } = ctx.request.body
    if (option) {
      if (typeof (option) === 'string') { [option, isentire, serial, size] = [Number(JSON.parse(option)), Number(JSON.parse(isentire)), JSON.parse(Number(serial)), Number(JSON.parse(size))] }
      if (option !== 1 && option !== 2) {
        ctx.body = {
          successFlag: 'N',
          errorMsg: '请求格式有误！'
        }
        return
      }
    }
    if (!isentire && isentire !== 0) isentire = 1
    if (!serial) serial = 1
    if (!size) size = 10
    const list = await this.service.news.GetList1(option, isentire, serial, size)
    const msg = list
    ctx.body = { code: 1, msg }
  }

  async updateList () {
    const ctx = this.ctx
    const { serial, question, classify, detail, tag } = ctx.request.body
    const VeriList = await ctx.service.news.VeriList(serial)

    if (!VeriList) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '列表更新失败！'
      }
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '更新成功！'
      }
      const row = {
        question,
        classify,
        detail,
        tag
      }

      const options = {
        where: {
          serial
        }
      }

      const result = await this.app.mysql.update('data_2020_test', row, options)// 更新 student_test 表中的记录

      // 判断更新成功
      const updateSuccess = result.affectedRows === 1
      if (updateSuccess) { console.log('更新成功') }
    }
  }

  async submitQue () {
    const ctx = this.ctx
    const { question, classify, detail, tag } = ctx.request.body
    const mark = await ctx.service.news.GetLengthOfData()
    if (!mark) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '记录添加失败！'
      }
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '记录添加成功！'
      }
      const row = {
        serial: mark,
        question,
        classify,
        detail,
        tag
      }

      const result = await this.app.mysql.insert('data_2020_test', row) // 在 data_2020_test 表中，插入记录

      // 判断插入成功
      const insertSuccess = result.affectedRows === 1
      if (insertSuccess) { console.log('更新成功') }
    }
  }

  async getUserInfo () {
    const ctx = this.ctx
    const { id } = ctx.request.body
    const info = await ctx.service.user.GetUserById(id)
    console.log(!info)
    if (info.length === 0) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '该学号不存在或该学号未注册！'
      }
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '学生信息获取成功！',
        msg: info
      }
    }
  }

  async getLikeStatus () {
    const ctx = this.ctx
    const { choice, id, serial } = ctx.request.body
    if (choice !== 'share' && choice !== 'discuss' && choice !== 'comment') {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误,获取失败!'
      }
      return
    }
    const info = await ctx.service.user.GetLikeById(choice, id, serial)
    if (info) ctx.body = 1
    else ctx.body = 0
  }

  async getLikeNum () {
    const ctx = this.ctx
    const { choice, serial } = ctx.request.body
    if (choice !== 'share' && choice !== 'discuss' && choice !== 'comment') {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误,获取失败!'
      }
      return
    }
    const info = await ctx.service.user.GetLikeBySe(choice, serial)
    if (!info) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败！'
      }
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '获取成功！',
        msg: info
      }
    }
  }

  async like () {
    const ctx = this.ctx
    const { choice, id, serial } = ctx.request.body
    const info = await ctx.service.user.LikeById(id, serial, choice)
    console.log(choice)
    if (choice !== 'share' && choice !== 'discuss' && choice !== 'comment') {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误,获取失败!'
      }
      return
    }
    if (!info) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '操作失败！'
      }
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '操作成功！'
      }
    }
  }

  async getUserInteract () {
    const ctx = this.ctx
    const { id, choice } = ctx.request.body
    let list = ''
    if (choice === 'comment') list = await this.service.news.GetCommentById(id)
    else if (choice === 'reply') list = await this.service.news.GetReplyById(id)
    else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误,获取失败!'
      }
      return
    }
    if (!list) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败!'
      }
      return
    }
    const msg = list
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '获取成功！',
      msg
    }
  }

  async modifyUserInfo () {
    const ctx = this.ctx
    const { nameOrid, password, choice, replacement } = ctx.request.body
    const VeriUser = await ctx.service.user.VeriUserByNaOrId(nameOrid, password)

    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '密码错误！'
      }
      return
    }

    const user = await ctx.service.user.getUserByNameOrId(nameOrid)
    const id = user.id

    let row = ''
    if (choice === 'password') {
      row = {
        id,
        password: replacement
      }
    } else if (choice === 'email') {
      row = {
        id,
        email: replacement
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '格式错误！'
      }
      return
    }

    const result = await this.app.mysql.update('student_test', row)// 更新 student_test 表中的记录

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1
    if (updateSuccess) { console.log('更新成功') }
  }

  async submitComment () {
    const ctx = this.ctx
    const { partition, formerserial, content, guestid, identity } = ctx.request.body
    const probe = await this.service.news.GetIdFromDiscuss(partition, formerserial)
    if (probe.length === 0) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '非法格式,提交失败!'
      }
      return
    }
    const lend = JSON.stringify(probe)
    const hostid = JSON.parse(lend)[0].guestid
    const mark = await this.service.news.GetSerialFromComment()
    const row = {
      serial: mark + 1,
      partition,
      formerserial,
      hostid,
      content,
      time: new Date(),
      guestid,
      identity
    }

    const result = await this.app.mysql.insert('comment', row) // 在 comment 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '提交成功！'
      }
    }
  }

  async submitReply () {
    const ctx = this.ctx
    const { partition, formerserial, content, guestid } = ctx.request.body
    const probe = await this.service.news.GetIdFromComment(partition, formerserial)
    if (probe.length === 0) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '非法格式,提交失败!'
      }
      return
    }
    const lend = JSON.stringify(probe)
    const hostid = JSON.parse(lend)[0].guestid
    const mark1 = await this.service.news.GetSerialFromReply()
    const mark2 = await this.service.news.GetFloorFromReply(partition, formerserial)
    const row = {
      serial: mark1 + 1,
      partition,
      formerserial,
      floor: mark2 + 1,
      hostid,
      content,
      time: new Date(),
      guestid
    }

    const result = await this.app.mysql.insert('reply', row) // 在 reply 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '提交成功！'
      }
    }
  }

  async getReplyOrComment () {
    const ctx = this.ctx
    const { choice, partition, formerserial } = ctx.request.body
    let list = ''
    if (choice === 'comment') list = await this.service.user.GetComment(partition, formerserial)
    else if (choice === 'reply') list = await this.service.user.GetReply(partition, formerserial)
    else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误,获取失败!'
      }
      return
    }
    if (list.length === 0) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '获取成功！',
        msg: null
      }
      return
    }
    const msg = list
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '获取成功！',
      msg
    }
  }

  async submitFeedback () {
    const ctx = this.ctx
    const { id, about, content } = ctx.request.body
    const mark = await ctx.service.news.GetLengthOfFeedback()
    if (!mark) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '记录添加失败！'
      }
    }
    const row = {
      serial: mark + 1,
      id,
      about,
      content
    }
    const result = await this.app.mysql.insert('feedback', row) // 在 feedback 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '记录添加成功！'
        // console.log('更新成功')
      }
    }
  }

  async getListNum () {
    const { ctx } = this
    const { choice } = ctx.request.body
    let table = ''

    if (choice === 'discuss') table = 'discuss_list'
    else if (choice === 'share') table = 'share_list'
    else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误, 获取失败!'
      }
      return
    }

    const length = await this.service.news.GetLengthOfList(table)
    if (!length) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败!'
      }
      return false
    }
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '获取成功！',
      length
    }
  }

  async printList () {
    const { ctx } = this
    let { choice, isentire, serial, size, partition } = ctx.request.body
    const partSet = ['git入门', '组件', '我爱运动', '我爱美食', '我爱学习', '布局设计']
    let table = ''

    if (choice === 'discuss') table = 'discuss_list'
    else if (choice === 'share') table = 'share_list'
    else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '输入格式有误, 获取失败!'
      }
      return
    }

    if (partition && !partSet.includes(partition)) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '不存在的分区,请求失败!'
      }
      return
    }

    if (typeof (isentire) === 'string') { [isentire, serial, size] = [Number(isentire), Number(serial), Number(size)] }

    if (!isentire && isentire !== 0) isentire = 1
    if (!serial) serial = 1
    if (!size) size = 5

    const list = await this.service.news.GetList2(table, isentire, serial, size, partition)
    if (!list) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败!'
      }
      return false
    }
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '获取成功！',
      msg: list
    }
  }

  async submitShare () {
    const ctx = this.ctx
    const { guestid, content, title } = ctx.request.body
    const mark = await this.service.news.GetSerialFromShare()

    const row = {
      serial: mark + 1,
      guestid,
      content,
      title,
      time: new Date()
    }

    const result = await this.app.mysql.insert('share_list', row) // 在 share 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '提交成功！'
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '提交失败！'
      }
    }
  }

  async submitDiscuss () {
    const ctx = this.ctx
    const { guestid, partition, content, title, identity } = ctx.request.body
    const mark = await this.service.news.GetSerialFromDiscuss()

    const row = {
      serial: mark + 1,
      guestid,
      partition,
      content,
      time: new Date(),
      title,
      identity
    }

    const result = await this.app.mysql.insert('discuss_list', row) // 在 problem 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '提交成功！'
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '提交失败！'
      }
    }
  }

  async saveProblem () {
    const ctx = this.ctx
    const { detail } = ctx.request.body
    const mark = await this.service.news.GetSerialFromProblem()

    const row = {
      serial: mark + 1,
      detail
    }

    const result = await this.app.mysql.insert('problem', row) // 在 problem 表中，插入记录

    // 判断插入成功
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '提交成功！'
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '提交失败！'
      }
    }
  }

  async printProblem () {
    const { ctx } = this
    let { isentire, serial, size } = ctx.request.body
    const a = Number(isentire)
    let b = Number(serial)
    let c = Number(size)
    if (!a && a !== 0) isentire = 1
    if (!b) b = 1
    if (!c) c = 5
    const list = await this.service.news.GetList3(a, b, c)
    ctx.body = {
      success: true,
      msg: list
    }
  }

  async getProblem () {
    const ctx = this.ctx
    const { id } = ctx.request.body

    const results = await this.app.mysql.select('problem', { // 搜索 problem 表
      where: { serial: id }, // WHERE 条件
      columns: ['detail'] // 要查询的表字段
    })
    const res = JSON.parse(JSON.stringify(results))
    // console.log(res)
    // 判断读取成功
    if (results) {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '获取成功！',
        msg: res
      }
    } else {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败！'
      }
    }
  }

  async printFeedback () {
    const { ctx } = this
    const list = await this.app.mysql.select('feedback')
    if (!list) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '获取失败!'
      }
      return false
    }
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '获取成功！',
      msg: list
    }
  }
}
module.exports = HomeController
