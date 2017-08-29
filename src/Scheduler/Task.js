'use strict'

const _ = require('lodash')
const ms = require('ms')
const Locker = require('./Locker')

/**
 * @module Task
 * @description Task base class
 */
class Task {
  /**
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Helpers', 'Adonis/Src/Logger']
  }

  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `tmpPath()`
   *
   * @return {Boolean}
   */
  static get useLock () {
    return false
  }

  /**
   * Set enable use prefix for logging
   *
   * @return {Boolean}
   */
  static get useLogPrefix () {
    return true
  }

  /**
   * Set log driver. By default is used value from config `app.logger.driver`
   * You can set any value from app.logger drivers
   *
   * @return {null|String}
   */
  static get loggerDriver () {
    return null
  }

  /**
   * @param {Object} Helpers
   * @param {Object} Logger
   */
  constructor (Helpers, Logger) {
    this.Helpers = Helpers
    this.Logger = Logger
    this.name = this._getName()
    this.locker = this._getLocker()
    this.loggerInstance = this._getLogger()
    this.startedAt = null

    this._extendLogger()
  }

  /**
   * Example input JasperEventsDrop
   * Example output jasper:events:drop
   *
   * @return {String}
   * @private
   */
  _getName () {
    return this.constructor.name
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .splice(1)
      .map((str) => str.toLowerCase())
      .join(':')
  }

  /**
   * @return {Logger}
   * @private
   */
  _getLogger () {
    const driver = this.constructor.loggerDriver
    if (driver) {
      return this.Logger.driver(driver)
    }
    return this.Logger
  }

  /**
   * @return {Locker}
   * @private
   */
  _getLocker () {
    return new Locker(this.name, this.Helpers.tmpPath())
  }

  /**
   * @return {void}
   */
  async _run () {
    const useLock = this.constructor.useLock

    if (useLock) {
      const locked = await this.locker.check()
      if (locked) {
        this.warning('Task is running, exit')
        return
      }

      await this.locker.lock()
    }

    this.startedAt = new Date()

    try {
      /**
       * Worker task handle
       */
      await this.handle()
    } catch (e) {
      this.error(e)
    }

    if (useLock) {
      await this.locker.unlock()
    }
  }

  /**
   * Get task running time duration
   *
   * @param {Boolean} [source]    Set true for return milliseconds value number
   * @return {Number}
   */
  duration (source = false) {
    let duration = new Date() - this.startedAt

    if (source) {
      return duration
    }

    duration = ms(duration)
    return duration
  }

  /**
   * Need set task name
   * It's create methods:
   *
   * Task.debug(message, ...options)
   * Task.info(message, ...options)
   * Task.notice(message, ...options)
   * and etc... see Adonis/Src/Logger
   *
   * @private
   */
  _extendLogger () {
    const types = [
      'debug',
      'info',
      'notice',
      'warning',
      'error',
      'crit',
      'alert',
      'emerg'
    ]

    types.forEach((method) => {
      this[method] = (...args) => {
        this._addLogPrefix(args)
        this.loggerInstance[method](...args)
      }
    })

    this['log'] = (level, ...args) => {
      this._addLogPrefix(args)
      this.loggerInstance['log'](level, ...args)
    }
  }

  /**
   * @param {Array} args
   * @private
   */
  _addLogPrefix (args) {
    if (!this.constructor.useLogPrefix) {
      return
    }

    if (_.isObject(args[0])) {
      args[0].task = this.name
    } else {
      args.unshift({ task: this.name })
    }
  }
}

module.exports = Task
