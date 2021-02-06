const Bull = require('bull')
const chokidar = require('chokidar')
const Service = require('egg').Service

const OJQueue = new Bull('online-judge-queue')

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
