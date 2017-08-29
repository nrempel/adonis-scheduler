'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('debug')('adonis:scheduler')
const { ioc } = require('@adonisjs/fold')
const CE = require('../Exceptions')
const Task = require('./Task')

/**
 * @module Scheduler
 * @description Task scheduler provider using node-schedule
 */
class Scheduler {
  /**
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  /**
   * @param {Object} Helpers
   */
  constructor (Helpers) {
    this.Helpers = Helpers
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
    this.tasksPath = path.join(this.Helpers.appRoot(), 'app', 'Tasks')
    this.tasksPath = path.normalize(this.tasksPath)
  }

  /**
   * Load task file
   *
   * @param {String} file
   * @private
   */
  async _fetchTask (file) {
    const filePath = path.join(this.tasksPath, file)
    let task
    try {
      task = require(filePath)
    } catch (e) {
      if (e instanceof ReferenceError) {
        debug('Unable to import task class <%s>. Is it a valid javascript class?', file)
        return
      } else {
        throw e
      }
    }

    // Get instance of task class
    const taskInstance = ioc.make(task)

    // Every task must expose a schedule
    if (!task.schedule) {
      throw CE.RuntimeException.undefinedTaskSchedule(file)
    }

    // Every task must expose a handle function
    if (!taskInstance.handle) {
      throw CE.RuntimeException.undefinedTaskHandle(file)
    }

    if (!(taskInstance instanceof Task)) {
      throw CE.RuntimeException.undefinedInstanceTask(file)
    }

    // Track currently registered tasks in memory
    this.registeredTasks.push(taskInstance)

    // Before add task to schedule need check & unlock file if exist
    const locked = await taskInstance.locker.check()
    if (locked) {
      await taskInstance.locker.unlock()
    }

    // Register task handler
    this.instance.scheduleJob(task.schedule, taskInstance._run.bind(taskInstance))
  }

  /**
   * Register scheduled tasks for every task found in app/Tasks
   *
   * @public
   */
  async run () {
    debug('Scan tasks path %s', this.tasksPath)
    let taskFiles

    try {
      taskFiles = fs.readdirSync(this.tasksPath)
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        debug('The tasks directory <%s> does not exist. Exiting.', this.tasksPath)
        return
      } else {
        // If it's some other error, bubble up exception
        throw e
      }
    }

    taskFiles.forEach(this._fetchTask.bind(this))
    debug('scheduler running %d tasks', this.registeredTasks.length)
  }
}

module.exports = Scheduler
