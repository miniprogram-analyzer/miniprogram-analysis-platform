/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1597228539709_2719'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  config.cluster = {
    listen: {
      path: '',
      port: 7000,
      hostname: '0.0.0.0'
    }
  }

  config.bodyParser = {
    jsonLimit: '1mb'
  }

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:8081', 'http://localhost:9527', 'http://122.51.210.8', 'http://localhost:8008', 'http://49.233.55.75', 'http://code.f00bar.top', 'http://bupt-c607.cn']
  }

  config.cors = {
    // origin: '*', // 匹配规则  域名+端口  *则为全匹配
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'user',
      // 密码
      password: 'password',
      // 数据库名
      database: 'debugs'
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  }
  // config.forbidip = {

  //  forbidips: [ '192.168.0.10' ],
  // };

  // config/config.default.js
  config.view = {
    mapping: {
      '.html': 'ejs'
    }
  }

  // 配置上传
  config.multipart = {
    fileSize: '500kb',
    mode: 'file',
    cleanSchedule: {
      cron: '0 30 4 * * *'
    },
    whitelist: ['.png', '.jpg', '.jpeg', '.gif', '.zip', '.gz', '.bz2', '.tar.gz'] // 扩展几种上传的文件格式
  }

  config.mpAnalyzer = {
    dataDir: '/data/miniprogram-analyzer'
  }

  config.logger = {
    disableConsoleAfterReady: false
  }

  return {
    ...config,
    ...userConfig
  }
}
