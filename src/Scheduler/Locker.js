'use strict'

const lockfile = require('lockfile')
const pify = require('pify')
const path = require('path')

class Locker {
  /**
   * @param {String} name
   * @param {String} lockDir
   */
  constructor (name, lockDir) {
    this.name = name
    this.lockDir = lockDir
    this.lockFilename = this._getLockFilePath()
  }

  /**
   * @return {String}
   * @private
   */
  _getLockFilePath () {
    return path.join(this.lockDir, `${this.name}.lock`)
  }

  /**
   * @return {Promise}
   */
  check () {
    return pify(lockfile.check)(this.lockFilename)
  }

  /**
   * @return {Promise}
   */
  lock () {
    return pify(lockfile.lock)(this.lockFilename)
  }

  /**
   * @return {Promise}
   */
  unlock () {
    return pify(lockfile.unlock)(this.lockFilename)
  }
}

module.exports = Locker
