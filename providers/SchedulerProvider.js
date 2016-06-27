'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class SchedulerProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Scheduler', function (app) {
      const Helpers = app.use('Adonis/Src/Helpers');
      const Scheduler = require('../src/Scheduler');
      return new Scheduler(Helpers);
    });
  }
}

module.exports = SchedulerProvider;
