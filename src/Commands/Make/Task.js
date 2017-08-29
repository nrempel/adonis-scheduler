'use strict'

const Base = require('./Base')

class MakeTask extends Base {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:task 
    { name: Name of the task }`
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Make a new task scheduler'
  }

  /**
   * Handle method executed by ace
   *
   * @method handle
   *
   * @param  {String} name
   *
   * @return {void}
   */
  async handle ({ name }) {
    try {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('task', name)
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeTask
