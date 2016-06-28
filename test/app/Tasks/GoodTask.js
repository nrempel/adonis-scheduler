'use strict';

class GoodTask {

  static get schedule() {
    return '*/1 * * * * *';
  }

  * handle() {
  
  }
}

module.exports = GoodTask;
