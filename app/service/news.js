'use strict'

const Service = require('egg').Service

class NewsService extends Service {
  async GetList1 (option, isentire, serial, size) {
    let table = ''
    if (option - 1) {
      table = 'data_2020_test'
    } else {
      table = 'data_2019'
    }
    let list = await this.app.mysql.query('select * from ' + table, '')
    if (!isentire) {
      list = list.slice(serial - 1, serial + size - 1)
    }
    return list
  }

  async GetList3 (isentire, serial, size) {
    const table = 'problem'
    // let list = await this.app.mysql.query('select * from ' + table, '')
    const results = await this.app.mysql.select(table, { // 搜索
      columns: ['serial', 'title'] // 要查询的表字段
    })
    let list = JSON.parse(JSON.stringify(results))
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
        columns: ['partition', 'formerserial', 'hostid', 'content', 'time', 'identity'] // 要查询的表字段
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
    const list = await this.app.mysql.query('select * from feedback', '')
    return list.length
  }

  async GetList2 (table, isentire, serial, size, content) {
    let ser
    if (content) {
      ser = await this.app.mysql.select(table, { // 搜索 table 表
        where: { partition: content } // WHERE 条件
      })
    } else {
      ser = await this.app.mysql.select(table)
    }
    if (!ser) {
      return false
    }
    let list = ''
    if (!isentire) {
      list = ser.slice(serial - 1, serial + size - 1)
    } else {
      return ser
    }
    return list
  }

  async GetLengthOfList (table) {
    const list = await this.app.mysql.query('select * from ' + table, '')
    return list.length
  }

  async GetIdFromDiscuss (partition, formerserial) {
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

  async GetFromComment (partition, formerserial) {
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

  async GetSerialFromComment () {
    const list = await this.app.mysql.query('select * from comment', '')
    return list.length
  }

  async GetSerialFromReply () {
    const list = await this.app.mysql.query('select * from reply', '')
    return list.length
  }

  async GetSerialFromProblem () {
    const list = await this.app.mysql.query('select * from problem', '')
    return list.length
  }

  async GetSerialFromShare () {
    const list = await this.app.mysql.query('select * from share_list', '')
    return list.length
  }

  async GetSerialFromDiscuss () {
    const list = await this.app.mysql.query('select * from discuss_list', '')
    return list.length
  }

  async GetFloorFromReply (partition, formerserial) {
    const info = await this.app.mysql.select('reply',
      {
        where: {
          partition,
          formerserial
        } // WHERE 条件
      })
    if (!info) return false
    return info.length
  }

  async GenerateUuidJustRandom () {
    let name = ''
    let data = new Date().getTime()
    data = name + data
    for (let i = 0; i < 16; i++) {
      const r = Math.floor(Math.random() * 16)
      name += r.toString(16)
    }
    return data + '-' + name
  }

  async GenerateUuidAddId (id) {
    let name = ''
    let data = new Date().getTime()
    data = name + data
    for (let i = 0; i < 16; i++) {
      const r = Math.floor(Math.random() * 16)
      name += r.toString(16)
    }
    return data + '-' + name + '-' + id
  }
}
module.exports = NewsService
