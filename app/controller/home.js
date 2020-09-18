'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '你好, egg';
  }

  async remove_cookie() {
    const ctx = this.ctx;
    ctx.cookies.set('count', null);
    ctx.status = 204;
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
    } else {
      let count = ctx.cookies.get('count');
      count = count ? Number(count) : 0;
      ctx.cookies.set('count', ++count);
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '登录成功！',
	//msg:count,
      };
    }
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
      } else {
        ctx.body = {
          successFlag: 'N',
          errorMsg: '该用户名已被注册！',
        };
      }
    }
  }

  async get_list(t) {
    const list = await this.service.news.GetList(t);
    const { ctx } = this;
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
      try {
        // process file or upload to cloud storage
        // 读取文件
        // let file = fs.readFileSync(file.filepath) // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
        // 将文件存到指定位置
        fs.writeFileSync(path.join('./', file.filename), file);
        // ctx.cleanupRequestFiles()
      } finally {
        // remove tmp files and don't block the request's response
        // cleanupRequestFiles won't throw error even remove file io error happen
        ctx.cleanupRequestFiles([ file ]);
      }
      // console.log(result);
    }
  }

  async get_userinfo() {
    const ctx = this.ctx;
    const { username } = ctx.request.body;
	  console.log(username);
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
}

module.exports = HomeController;

