'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  /**
   * Registers providers for all the migration related
   * commands
   *
   * @method _registerCommands
   *
   * @return {void}
   */
  _registerCommands () {
    this.app.bind('Adonis/Commands/Run:Scheduler', () => require('../src/Commands/Run/Scheduler'))
    this.app.bind('Adonis/Commands/Make:Task', () => require('../src/Commands/Make/Task'))
  }

  /**
   * Register all the required providers
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerCommands()
  }

  /**
   * On boot add commands with ace
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Run:Scheduler')
    ace.addCommand('Adonis/Commands/Make:Task')
  }
}

module.exports = CommandsProvider
