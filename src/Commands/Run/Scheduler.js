'use strict'

const { Command } = require('@adonisjs/ace')

class Scheduler extends Command {
  /**
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Addons/Scheduler']
  }

  /**
   * @param {Object} Scheduler
   */
  constructor (Scheduler) {
    super()
    this.scheduler = Scheduler
  }

  /**
   * @return {String}
   */
  static get signature () {
    return 'run:scheduler'
  }

  /**
   * @return {String}
   */
  static get description () {
    return 'Start the scheduler.'
  }

  /**
   * @return {void}
   */
  async handle () {
    this.scheduler.run()
  }
}

module.exports = Scheduler
