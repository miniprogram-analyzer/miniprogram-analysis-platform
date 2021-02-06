const Bull = require('bull')
const chokidar = require('chokidar')
const Service = require('egg').Service
const redisConfig = require('../../config/queue')

// TODO: 可能存在问题，队列在每次网络请求时重新实例化
// https://eggjs.org/zh-cn/basics/service.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9
const OJQueue = new Bull('online-judge-queue', { redis: redisConfig.redis })

OJQueue.process(async job => {
  await checkResult(job.data.fileName)
  console.log(`## job ${job.data.fileName} done.`)
})

async function checkResult (fileName) {
  return new Promise(function (resolve, reject) {
    const watcher = chokidar.watch('results').on('raw', (event, path, details) => {
      if (path === fileName) {
        resolve()
        watcher.close().then(() => console.log(`## ${fileName} watcher closed.`))
      }
    })
  })
}

class QueueService extends Service {
  // Example:
  // job = {
  //   fileName: 'foo'
  // }
  async add (job) {
    OJQueue.add(job)
  }
}

module.exports = QueueService
