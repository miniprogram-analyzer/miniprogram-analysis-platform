const Bull = require('bull')
const chokidar = require('chokidar')
const Service = require('egg').Service
const redisConfig = require('../../config/queue')
const { execFile } = require('child_process')

// TODO: 可能存在问题，队列在每次网络请求时重新实例化
// https://eggjs.org/zh-cn/basics/service.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9
const OJQueue = new Bull('online-judge-queue', { redis: redisConfig.redis })

const RESULTS_PATH = '/data/miniprogram-analyzer/OJ-results'
const TEST_FILE_PATH = '/data/miniprogram-analyzer/test.sh'

OJQueue.process(async job => {
  execFile(TEST_FILE_PATH, [job.data.filename, job.data.question], (error, stdout, stderr) => {
    if (error) {
      throw error
    }
    console.log(stdout)
  })
  await checkResult(job.data.filename)
  console.log(`## job ${job.data.filename} done.`)
})

async function checkResult (filename) {
  return new Promise(function (resolve, reject) {
    const watcher = chokidar.watch(RESULTS_PATH).on('raw', (event, path, details) => {
      console.log(event, path, details)
      if (path === `result_${filename}.json`) {
        resolve()
        watcher.close().then(() => console.log(`## ${filename} watcher closed.`))
      }
    })
  })
}

class QueueService extends Service {
  // Example:
  // job = {
  //   filename: 'foo',
  //   question: 'question1'
  // }
  async add (job) {
    OJQueue.add(job)
  }
}

module.exports = QueueService
