'use strict'

const { Command } = require('@adonisjs/ace')

class Scheduler extends Command {

  static get inject () {
    return ['Adonis/Addons/Scheduler']
  }

  constructor (Scheduler) {
    super()
    this.scheduler = Scheduler
  }

  static get signature () {
    return 'run:scheduler'
  }

  static get description () {
    return 'Start the scheduler.'
  }

  async handle () {
    this.scheduler.run()
  }
}

module.exports = Scheduler
