'use strict';
const fs = require('fs');

const BACKUP_SUFFIX = '-bckup'
const { name: PLUGIN_NAME } = require('./package.json')

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = serverless.service.custom.injectFile || {}

    // catch ctrl+c event and exit normally
    process.on('SIGINT', () => process.exit(2));
    
    this.hooks = {
      'after:package:initialize': this.injectFiles.bind(this),
    };
  }

  log(msg) {
    this.serverless.cli.log(msg, PLUGIN_NAME)
  }

  injectFiles() {
    for (const fileName in this.options) {
      this.injectFile(fileName)
    }
  }

  injectFile(fileName) {
    const backupFileName = fileName + BACKUP_SUFFIX

    try {
      if (fs.existsSync(fileName)) {
        fs.renameSync(fileName, backupFileName)
        this.log('created backup for ' + fileName)
      }

      fs.writeFileSync(fileName, this.options[fileName])

      process.on('exit', () => {
        fs.unlinkSync(fileName)

        if (fs.existsSync(backupFileName)) {
          fs.renameSync(backupFileName, fileName)
          this.log('restored backup for ' + fileName)
        }
      });

    } catch (e) {
      this.log(e)
    }
  }
}

module.exports = ServerlessPlugin;
