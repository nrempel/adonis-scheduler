'use strict'

const Task = use('Task')

class NoHandler extends Task {
  static get schedule () {
    return '*/1 * * * * *'
  }
}

module.exports = NoHandler
