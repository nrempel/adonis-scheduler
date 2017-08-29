'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class SchedulerProvider extends ServiceProvider {
  /**
   * Register the scheduler to the IoC container
   * with `Adonis/Addons/Scheduler` namespace.
   *
   * @method _registerScheduler
   *
   * @return {void}
   *
   * @private
   */
  _registerScheduler () {
    this.app.singleton('Adonis/Addons/Scheduler', () => make(require('../src/Scheduler')))
  }

  /**
   * Register the task to the IoC container
   * with `Adonis/Addons/Task` namespace.
   *
   * @method _registerTask
   *
   * @return {void}
   *
   * @private
   */
  _registerTask () {
    this.app.bind('Adonis/Addons/Task', () => require('../src/Scheduler/Task'))
    this.app.alias('Adonis/Addons/Task', 'Task')
  }

  /**
   * Register bindings
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerScheduler()
    this._registerTask()
  }
}

module.exports = SchedulerProvider
