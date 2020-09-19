'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async GetUserByNa(username) {
    const user = await this.app.mysql.get('student_test',
      {
        where: { username }, // WHERE 条件
        columns: [ 'id', 'email', 'phone' ], // 要查询的表字段
      });
    if (!user) {
      return false;
    }
    return user;
  }

  async getUserByNameOrId(nameOrId) {
    const userById = await this.app.mysql.get('student_test', { id: nameOrId });
    const userByName = await this.app.mysql.get('student_test', { username: nameOrId });
    const user = userById || userByName || {};
    const { id, username } = user;
    return {
      id,
      username
    };
  }

  async VeriUserById(id) {
    const user = await this.app.mysql.get('student_test', { id });
    if (!user || user.username ) {
      return false;
    }
    return true;
  }

  async VeriUserByNaOrId(nameOrid, password) {
    const userByname = await this.app.mysql.get('student_test', { username: nameOrid });
    const userByid = await this.app.mysql.get('student_test', { id: nameOrid });
    if (!userByname || userByname.password !== password) {
      return false;
    }
    if (!userByid || userByid.password !== password) {
      return false;
    }
    return true;
  }

  async VeriUserByNa(username, password) {
    const user = await this.app.mysql.get('student_test', { username });
    if (!user || user.password !== password) {
      return false;
    }
    return true;
  }

  async VeriRepByNa(username) {
    const user = await this.app.mysql.query('select * from student_test', '');
    var j = 0;
    if (user) {
      for (let i = 0; i < user.length; i++) {
        if (user[i].username === username) { j++; }
      }
      if (!j) {
        return false;
      }
      return true;
    }
    return true;
  }

  async GetLikeByNa(username, serial) {
    const user = await this.app.mysql.get('student_test', { username });
    if (!user || user.id) {
      return false;
    }
    const id = user.id;
    const info = await this.app.mysql.get('like_list', { id });
    if (!info || user.likes) {
      return false;
    }
    const likes = info.likes;
    if (Number(likes[serial - 1])) return true;
    return false;
  }

  async GetLikeBySe(serial) {
    const like_list = await this.app.mysql.query('select * from like_list', '');
    let numof = 0;
    for (let i = 0; i < like_list.length; i++) {
      if (Number(like_list[i].likes[serial - 1])) numof++;
    }
    const row = {
      serial,
      numof,
    };
    const result = await this.app.mysql.update('list', row);// 更新 list 表中的记录
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) return true;
    return false;
  }

  async LikeByNa(username, serial) {
    const user = await this.app.mysql.get('student_test', { username });
    if (!user || user.id) {
      return false;
    }
    const id = user.id;
    const info = await this.app.mysql.get('like_list', { id });
    if (!info || user.likes) {
      return false;
    }
    const likes = info.likes;
    const tt = likes[serial - 1];
    likes[serial - 1] = Math.abs(tt - 1);
    const row = {
      id,
      likes,
    };
    const result = await this.app.mysql.update('like_list', row);// 更新 like_list 表中的记录
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) return true;
    return false;
  }
}
module.exports = UserService;

