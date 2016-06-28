'use strict';

class NoHandlerTask {

  get schedule() {
    return '*/1 * * * * *';
  }
  
}

module.exports = NoHandlerTask;
