'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('debug')('adonis:scheduler')
const { ioc } = require('@adonisjs/fold')

/**
 * @module Scheduler
 * @description Task scheduler provider using node-schedule
 */
class Scheduler {

  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  constructor (Helpers) {
    this.helpers = Helpers
    this.instance = require('node-schedule')
    this.registeredTasks = []

    this._configureTasksPath()
  }

  /**
   * Configure tasks absolute path for app
   * /<project-dir>/app/Tasks
   *
   * @private
   */
  _configureTasksPath () {
    this.tasksPath = path.join(this.helpers.appRoot(), 'app', 'Tasks')
    this.tasksPath = path.normalize(this.tasksPath)
  }

  /**
   * Register scheduled tasks for every task found in app/Tasks
   *
   * @public
   */
  run () {
    try {
      debug('Scan tasks path %s', this.tasksPath)

      const taskFiles = fs.readdirSync(this.tasksPath)
      taskFiles.forEach((file) => {
        try {
          const filePath = path.join(this.tasksPath, file)
          const Task = require(filePath)
          // Get instance of task class
          const taskInstance = ioc.make(Task)

          // Every task must expose a schedule
          if (!Task.schedule) {
            throw new Error(`No schedule found for task: ${filePath}`)
          }

          // Every task must expose a handle function
          if (!taskInstance.handle) {
            throw new Error(`No handler found for task: ${filePath}`)
          }

          // Track currently registered tasks in memory
          this.registeredTasks.push(Task)

          // Register task handler
          this.instance.scheduleJob(Task.schedule, taskInstance.handle.bind(taskInstance))
        } catch (e) {
          if (e instanceof ReferenceError) {
            debug('Unable to import task class <%s>. Is it a valid javascript class?', file)
          } else {
            throw e
          }
        }
      })
      debug('scheduler running %d tasks', this.registeredTasks.length)
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        debug('The tasks directory <%s> does not exist. Exiting.', this.tasksPath)
      } else {
        // If it's some other error, bubble up exception
        throw e
      }
    }
  }

}

module.exports = Scheduler
