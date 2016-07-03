'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');
const CatLog = require('cat-log');
const logger = new CatLog('adonis:scheduler');
const Ioc = require('adonis-fold').Ioc;

/**
 * @module Scheduler
 * @description Task scheduler provider using node-schedule
 */
class Scheduler {
  constructor (Helpers) {
    this.logger = new CatLog('adonis:scheduler');
    this.tasksPath = path.join(Helpers.appPath(), 'Tasks');
    this.tasksPath = path.normalize(this.tasksPath);
    this.instance = require('node-schedule');
    this.registeredTasks = [];
  }

  /**
   * Register scheduled tasks for every task found in app/Tasks
   *
   * @public
   */
  run () {
    try {
      const taskFiles = fs.readdirSync(this.tasksPath);
      taskFiles.forEach(file => {
        const filePath = path.join(this.tasksPath, file);
        try {
          const Task = require(filePath);
          // Get instance of task class
          const taskInstance = Ioc.make(Task);

          // Every task must expose a schedule
          if (!Task.schedule) {
            throw new Error(`No schedule found for task: ${filePath}`);
          }

          // Every task must expose a handle function
          if (!taskInstance.handle) {
            throw new Error(`No handler found for task: ${filePath}`);
          }

          // Track currently registered tasks in memory
          this.registeredTasks.push(Task);

          // Register task handler
          this.instance.scheduleJob(Task.schedule, co.wrap(taskInstance.handle.bind(taskInstance)));
        } catch (e) {
          // If this file is not a valid javascript class, print warning and return
          if (e instanceof ReferenceError) {
            this.logger.warn('Unable to import task class <%s>. Is it a valid javascript class?', file);
            return;
          } else {
            throw e;
          }
        }
      });
      this.logger.info('scheduler running %d tasks', this.registeredTasks.length);
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        this.logger.info('The tasks directory <%s> does not exist. Exiting.', this.tasksPath);
      } else {
        // If it's some other error, bubble up exception
        throw e;
      }
    }
  }
}

module.exports = Scheduler;
