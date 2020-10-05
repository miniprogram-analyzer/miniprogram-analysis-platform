'use strict'

const Service = require('egg').Service

class NewsService extends Service {
  async GetList1 (option, isentire, serial, size) {
    let database = ''
    if (option - 1) {
      database = 'data_2020_test'
    } else {
      database = 'data_2019'
    }
    let list = await this.app.mysql.query('select * from ' + database, '')
    if (!isentire) {
      list = list.slice(serial - 1, serial + size - 1)
    }
    return list
  }

  async GetLengthOfData () {
    const list = await this.app.mysql.query('select * from data_2020_test', '')
    const mark = list.length
    return mark + 1
  }

  async VeriList (serial) {
    const ser = await this.app.mysql.get('data_2019', { serial })
    if (!ser) {
      return false
    }
    return true
  }

  async GetCommentById (id) {
    const info = await this.app.mysql.select('comment',
      {
        where: {
          guestid: id
        }, // WHERE 条件
        columns: ['partition', 'formerserial', 'hostid', 'content', 'time'] // 要查询的表字段
      })
    if (!info) return false
    return info
  }

  async GetReplyById (id) {
    const info = await this.app.mysql.select('reply',
      {
        where: {
          guestid: id
        }, // WHERE 条件
        columns: ['partition', 'formerserial', 'hostid', 'content', 'time', 'floor'] // 要查询的表字段
      })
    if (!info) return false
    return info
  }

  async GetLengthOfFeedback () {
    const mark = await this.app.mysql.query('select * from feedback', '').length
    return mark
  }

  async GetList2 (database) {
    const ser = await this.app.mysql.query('select * from ' + database, '')
    if (!ser) {
      return false
    }
    return ser
  }

  async GetIdFormDiscuss (partition, formerserial) {
    const info = await this.app.mysql.select('discuss_list',
      {
        where: {
          partition,
          serial: formerserial
        }, // WHERE 条件
        columns: ['guestid'] // 要查询的表字段
      })
    if (!info) return false
    return info
  }

  async GetIdFormComment (partition, formerserial) {
    const info = await this.app.mysql.select('comment',
      {
        where: {
          partition,
          serial: formerserial
        }, // WHERE 条件
        columns: ['guestid'] // 要查询的表字段
      })
    if (!info) return false
    return info
  }

  async GetSerialFormComment () {
    const mark = await this.app.mysql.query('select * from comment', '').length
    return mark
  }

  async GetSerialFormReply () {
    const mark = await this.app.mysql.query('select * from reply', '').length
    return mark
  }

  async GetFloorFormReply (partition, formerserial) {
    const info = await this.app.mysql.select('reply',
      {
        where: {
          partition,
          formerserial
        } // WHERE 条件
      })
    if (!info) return false
    console.log(info.length) // for test
    return info.length
  }
}

module.exports = NewsService
