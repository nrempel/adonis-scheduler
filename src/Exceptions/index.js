'use strict'

/*
 * adonis-lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const GE = require('@adonisjs/generic-exceptions')

/**
 * Class to throw runtime exceptions
 *
 * @class RuntimeException
 * @constructor
 */
class RuntimeException extends GE.RuntimeException {
  /**
   * This exception is raised when task an undefined schedule
   *
   * @method undefinedTaskSchedule
   *
   * @param  {String}          task
   *
   * @return {Object}
   */
  static undefinedTaskSchedule (task) {
    return new this(`${task} is not defined on schedule value`, 500, 'E_INVALID_TASK_SCHEDULE')
  }

  /**
   * This exception is raised when task an undefined handle
   *
   * @method undefinedTaskHandle
   *
   * @param  {String}          task
   *
   * @return {Object}
   */
  static undefinedTaskHandle (task) {
    return new this(`${task} is not defined on handle value`, 500, 'E_INVALID_TASK_HANDLE')
  }

  /**
   * This exception is raised when task an undefined handle
   *
   * @method undefinedInstanceTask
   *
   * @param  {String}          task
   *
   * @return {Object}
   */
  static undefinedInstanceTask (task) {
    return new this(`${task} is not extend of class Task`, 500, 'E_INVALID_TASK_INSTANCE')
  }

  /**
   * This exception is raised when task an undefined handle
   *
   * @method notFoundTask
   *
   * @param  {String}          dir
   *
   * @return {Object}
   */
  static notFoundTask (dir) {
    return new this(`Not found task dir ${dir}`, 500, 'E_INVALID_SCHEDULER_DIR')
  }
}

module.exports = {
  RuntimeException
}
