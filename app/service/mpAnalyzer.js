'use strict'
const fse = require('fs-extra')
const compressing = require('compressing')
const globby = require('globby')
const path = require('path')

const Service = require('egg').Service

const { inspect: miniprogramAnalyzer } = require('miniprogram-analyzer2')

class mpAnalyzer extends Service {
  async saveFile (file, dest = path.join(this.app.config.mpAnalyzer.dataDir, 'miniprograms')) {
    fse.ensureDirSync(dest)
    const filename = `${dest}/${(new Date()).getTime()}-${file.filename}`
    fse.copyFileSync(file.filepath, filename)
    return filename
  }

  async unarchive (source, type = 'zip') {
    // dirname + basename
    // /data/miniprogram-analyzer/1601885584728-daima-v2.zip
    // =>
    // /data/miniprogram-analyzer/1601885584728-daima-v2
    const dest = source.split(`.${type}`)[0]
    fse.ensureDirSync(dest)
    await compressing.zip.uncompress(source, dest)
    return dest
  }

  getMPRootDir (mpDir) {
    const globbyOptions = {
      cwd: mpDir
    }

    const files = globby.sync('**/project.config.json', globbyOptions)

    if (files.length === 0) {
      return mpDir
    } else {
      return path.join(mpDir, path.dirname(files[0]))
    }
  }

  async analyze (mpDir) {
    const mpRootDir = this.getMPRootDir(mpDir)
    const reportDir = path.join(this.app.config.mpAnalyzer.dataDir, 'reports', path.basename(mpDir))
    const report = await miniprogramAnalyzer(mpRootDir, reportDir)
    report.platoReport = path.join(reportDir, 'plato')
    return report
  }
}

module.exports = mpAnalyzer
