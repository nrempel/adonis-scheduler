'use strict'

const Task = use('Task')

class Working extends Task {
  static get schedule () {
    return '*/1 * * * * *'
  }

  async handle () {
  }
}

module.exports = Working
