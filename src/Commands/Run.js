'use strict';

const Ioc = require('adonis-fold').Ioc;
const Command = Ioc.use('Adonis/Src/Command');

class Listen extends Command {

  constructor (Scheduler) {
    super();
    this.scheduler = Scheduler;
  }

  get signature () {
    return 'scheduler:run';
  }

  get description () {
    return 'Start the scheduler.';
  }

  * handle (options, flags) {
    yield this.scheduler.run();
  }
}

module.exports = Listen;
