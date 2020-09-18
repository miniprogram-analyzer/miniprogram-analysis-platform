'use strict';

const Service = require('egg').Service;

class NewsService extends Service {
  async GetList(t) {
    let database = '';
    if (t) {
      database = 'data_2019';
    } else {
      database = 'data_2020_test';
    }
    const list = await this.app.mysql.query('select * from ' + database, '');
    return list;
  }

  async GetMark() {
    const list = await this.app.mysql.query('select * from data_2020_test', '');
    const mark = list.length;
    return mark + 1;
  }

  async VeriList(serial) {
    const ser = await this.app.mysql.get('data_2019', { serial });
    if (!ser) {
      return false;
    }
    return true;
  }
}


module.exports = NewsService;

