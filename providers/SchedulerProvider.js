'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class SchedulerProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Scheduler', () => make(require('../src/Scheduler')))
  }
}

module.exports = SchedulerProvider
