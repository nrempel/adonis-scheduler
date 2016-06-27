'use strict';

class NoHandlerTask {

  static get schedule() {
    return '*/1 * * * * *';
  }
  
}

module.exports = NoHandlerTask;
