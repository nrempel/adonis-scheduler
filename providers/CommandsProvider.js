'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class CommandsProvider extends ServiceProvider {
  * register () {
    this.app.bind('Adonis/Commands/Scheduler:Run', function (app) {
      const Scheduler = app.use('Adonis/Addons/Scheduler');
      const Run = require('../src/Commands/Run');
      return new Run(Scheduler);
    });
  }
}

module.exports = CommandsProvider;
