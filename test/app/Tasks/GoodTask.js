'use strict';

class GoodTask {

  static get schedule() {
    return '*/1 * * * * *';
  }

  static handle() {
    
  }
}

module.exports = GoodTask;
