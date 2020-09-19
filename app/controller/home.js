'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '你好, egg';
  }

  async login() {
    const ctx = this.ctx;
    const { nameOrid, password } = ctx.request.body;
    const VeriUser = await ctx.service.user.VeriUserByNaOrId(nameOrid, password);

    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '用户名不存在或者密码错误',
      };
      return;
    }

    const userInfo = await ctx.service.user.getUserByNameOrId(nameOrid);
    console.log(userInfo);

    // auth: boolean 判断用户登录状态
    ctx.session.auth = true;
    ctx.body = {
      successFlag: 'Y',
      errorMsg: '登录成功！',
      data: {
        userInfo
      }
    };
  }

  async register() {
    const ctx = this.ctx;
    const { id, username, password } = ctx.request.body;
    const VeriUser = await ctx.service.user.VeriUserById(id);
    const VeriRep = await ctx.service.user.VeriRepByNa(username);


    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '学号错误或者学号已注册！',
      };
    } else {
      if (!VeriRep) {
        ctx.body = {
          successFlag: 'Y',
          errorMsg: '验证成功,请登录！',
        };
        const row = {
          id,
          username,
          password,
        };
        const result = await this.app.mysql.update('student_test', row);// 更新 student_test 表中的记录

        // 判断更新成功
        const updateSuccess = result.affectedRows === 1;
        if (updateSuccess) {
          console.log('更新成功');
        }

        ctx.session.auth = true;
      } else {
        ctx.body = {
          successFlag: 'N',
          errorMsg: '该用户名已被注册！',
        };
      }
    }
  }

  async log_out() {
    const { ctx } = this;

    ctx.session = null;
    
    ctx.status = 204;
  }

  async get_list() {
    const { ctx } = this;
    let { option, isentire, serial, size } = ctx.request.body;
    if(option !== 1 || option !== 2){
      ctx.body = {        
	successFlag: 'N',
        errorMsg: '请求格式有误！',
      };
      return;
    }
    if(!isentire) isentire = 1;
    if (!serial) serial = 1;
    if (!size) size = 10;
    const list = await this.service.news.GetList(option, isentire, serial, size);
    const msg = list;
    ctx.body = { code: 1, msg };
  }

  async update_list() {
    const ctx = this.ctx;
    const { serial, question, classify, detail, tag } = ctx.request.body;
    const VeriList = await ctx.service.news.VeriList(serial);

    if (!VeriList) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '列表更新失败！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '更新成功！',
      };
      const row = {
        question,
        classify,
        detail,
        tag,
      };

      const options = {
	where: {
	  serial
 	}	
      };

      const result = await this.app.mysql.update('data_2020_test', row, options);// 更新 student_test 表中的记录

      // 判断更新成功
      const updateSuccess = result.affectedRows === 1;
      if (updateSuccess) { console.log('更新成功'); }
    }
  }

  async submit_que() {
    const ctx = this.ctx;
    const { question, classify, detail, tag } = ctx.request.body;
    const mark = await ctx.service.news.GetMark();
    if (!mark) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '记录添加失败！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '记录添加成功！',
      };
      const row = {
	serial:mark,
        question,
        classify,
        detail,
        tag,
      };

      const result = await this.app.mysql.insert('data_2020_test', row); // 在 data_2020_test 表中，插入记录

      // 判断插入成功
      const insertSuccess = result.affectedRows === 1;
      if (insertSuccess) { console.log('更新成功'); }
    }
  }

  async upload_file() {
    const { ctx } = this;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);
    for (const file of ctx.request.files) {
      console.log('field: ' + file.fieldname);
      console.log('filename: ' + file.filename);
      console.log('encoding: ' + file.encoding);
      console.log('mime: ' + file.mime);
      console.log('tmp filepath: ' + file.filepath);
      if(!file.filename){
        ctx.body = {
          successFlag: 'N',
          errorMsg: '上传失败！',
        };
      } else {
        ctx.body = {
          successFlag: 'Y',
          errorMsg: '上传成功！',
        };
      }
      fs.writeFileSync(path.join('./', file.filename), file);
    }
  }

  async get_user_info() {
    const ctx = this.ctx;
    const { username } = ctx.request.body;
    //测试用
    //console.log(username);
    const info = await ctx.service.user.GetUserByNa(username);

    if (!info) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '该学号不存在或该学号未注册！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '学生信息获取成功！',
        msg: info,
      };
    }
  }

  async get_like_status() {
    const ctx = this.ctx;
    const { username, serial } = ctx.request.body;
    const info = await ctx.service.user.GetLikeByNa(username, serial);
    if (info) ctx.body.msg = 1;
    else ctx.body.msg = 0;
  }

  async get_like_num() {
    const ctx = this.ctx;
    const { serial } = ctx.request.body;
    const info = await ctx.service.user.GetLikeBySe(serial);
    const like = await this.app.mysql.get('list', { serial });
    if (info) ctx.body.msg = like.numof;
  }

  async like() {
    const ctx = this.ctx;
    const { username, serial } = ctx.request.body;
    const info = await ctx.service.user.LikeByNa(username, serial);
    if (!info) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '操作失败！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '操作成功！',
      };
    }
  }

  async modify_user_info() {
    const ctx = this.ctx;
    const { nameOrid, password, choice, replacement }  = ctx.request.body;
    const VeriUser = await ctx.service.user.VeriUserByNaOrId(nameOrid, password);

    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '密码错误',
      };
      return;
    }

    var id = 0;
    if(Number(nameOrid) === nameOrid) id = nameOrid;
    else {
      const user = await ctx.service.user.GetUserByNa(nameOrid);
      id = user.id;
    }
    let row = '';
    if(choice === 'password') {
      row = {
	id,
      	password:replacement,
      };
    }
    else{
      row = {
        id,
        email:replacement,
      };
    }
	  
    const result = await this.app.mysql.update('student_test', row);// 更新 student_test 表中的记录

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) { console.log('更新成功'); }
  }

}

module.exports = HomeController;

