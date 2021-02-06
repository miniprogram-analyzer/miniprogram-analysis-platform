/* eslint-disable camelcase */
'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async GetUserById (id) {
    const user = await this.app.mysql.select('student_test',
      {
        where: { id }, // WHERE 条件
        columns: ['email', 'phone', 'face'] // 要查询的表字段
      })
    if (!user) {
      return false
    }
    return user
  }

  async getUserByNameOrId (nameOrId) {
    const userById = await this.app.mysql.get('student_test', { id: nameOrId })
    const userByName = await this.app.mysql.get('student_test', { username: nameOrId })
    const user = userById || userByName || {}
    const { id, username, identity } = user
    return {
      id,
      username,
      identity
    }
  }

  async VeriUserById (id) {
    const user = await this.app.mysql.get('student_test', { id })
    if (!user || user.username) {
      return false
    }
    return true
  }

  async VeriUserByNaOrId (nameOrid, password) {
    const userByname = await this.app.mysql.get('student_test', { username: nameOrid })
    const userByid = await this.app.mysql.get('student_test', { id: nameOrid })
    if (!userByname && !userByid) {
      return false
    }
    if ((!userByname || userByname.password !== password) && (!userByid || userByid.password !== password)) {
      return false
    }
    return true
  }

  async VeriUserByNa (username, password) {
    const user = await this.app.mysql.get('student_test', { username })
    if (!user || user.password !== password) {
      return false
    }
    return true
  }

  async VeriRepByNa (username) {
    const user = await this.app.mysql.query('select * from student_test', '')
    let j = 0
    if (user) {
      for (let i = 0; i < user.length; i++) {
        if (user[i].username === username) { j++ }
      }
      if (!j) {
        return false
      }
      return true
    }
    return true
  }

  async GetLikeById (choice, id, serial) {
    const list = await this.app.mysql.get('like_list', { id })
    if (!list) {
      return false
    }
    const info = JSON.parse(JSON.stringify(list))

    let likes
    if (choice === 'share') {
      likes = info.likes_share
    } else if (choice === 'discuss') {
      likes = info.likes_discuss
    } else {
      likes = info.likes_comment
    }

    if (Number(likes[serial - 1])) return true
    return false
  }

  async GetLikeBySe (column, serial) {
    var table = ''
    if (column === 'share') {
      const like_list = await this.app.mysql.select('like_list', {
        columns: ['likes_share']
      })
      var info = JSON.parse(JSON.stringify(like_list))
      table = 'share_list'
    } else if (column === 'discuss') {
      const like_list = await this.app.mysql.select('like_list', {
        columns: ['likes_discuss']
      })
      info = JSON.parse(JSON.stringify(like_list))
      table = 'discuss_list'
    } else {
      const like_list = await this.app.mysql.select('like_list', {
        columns: ['likes_conment']
      })
      info = JSON.parse(JSON.stringify(like_list))
      table = 'comment'
    }
    let numof = 0
    for (var item in info) {
      if (Number(Object.values(info[item])[0][serial - 1])) numof++
    }
    const row = {
      numof
    }
    const options = {
      where: {
        serial
      }
    }
    const result = await this.app.mysql.update(table, row, options)// 更新 table 中的记录
    const like = await this.app.mysql.select(table, {
      where: { serial }, // WHERE 条件
      columns: ['numof']
    })
    const updateSuccess = result.affectedRows === 1
    if (updateSuccess) return like
    return false
  }

  async LikeById (id, serial, column) {
    const list = await this.app.mysql.get('like_list', { id })
    // const info = await this.app.mysql.select('like_list', { // 搜索 like_list 表
    //   where: { id }, // WHERE 条件
    //   columns: [column] // 要查询的表字段
    // });
    if (!list) {
      return false
    }
    const info = JSON.parse(JSON.stringify(list))
    if (column === 'share') {
      const likes = info.likes_share
      const tt = likes[serial - 1]
      const lend = (likes.substring(0, serial - 1)) + Math.abs(tt - 1) + (likes.substring(serial))
      var row = {
        id,
        likes_share: lend
      }
    } else if (column === 'discuss') {
      const likes = info.likes_discuss
      const tt = likes[serial - 1]
      const lend = (likes.substring(0, serial - 1)) + Math.abs(tt - 1) + (likes.substring(serial))
      row = {
        id,
        likes_discuss: lend
      }
    } else {
      const likes = info.likes_comment
      const tt = likes[serial - 1]
      const lend = (likes.substring(0, serial - 1)) + Math.abs(tt - 1) + (likes.substring(serial))
      row = {
        id,
        likes_comment: lend
      }
    }
    const result = await this.app.mysql.update('like_list', row)// 更新 like_list 表中的记录
    const updateSuccess = result.affectedRows === 1
    if (updateSuccess) return true
    return false
  }

  async GetComment (partition, formerserial) {
    const message = await this.app.mysql.select('comment',
      {
        where: {
          partition,
          formerserial
        }, // WHERE 条件
        columns: ['serial', 'content', 'time', 'guestid', 'identity'] // 要查询的表字段
      })
    if (!message) {
      return false
    }
    return message
  }

  async GetReply (partition, formerserial) {
    const message = await this.app.mysql.select('reply',
      {
        where: {
          partition,
          formerserial
        }, // WHERE 条件
        columns: ['serial', 'floor', 'content', 'time', 'guestid'] // 要查询的表字段
      })
    if (!message) {
      return false
    }
    return message
  }
}

module.exports = UserService
