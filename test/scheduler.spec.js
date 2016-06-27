'use strict';

const path = require('path');
const Scheduler = require('../src/Scheduler');
const chai = require('chai');
const expect = chai.expect;
require('co-mocha');

const Helpers = {
  appPath: function () {
    return path.join(__dirname, './app');
  }
};

const HelpersBadTaskFile = {
  appPath: function () {
    return path.join(__dirname, './app_bad_task_file');
  }
};

const HelpersNoSchedule = {
  appPath: function () {
    return path.join(__dirname, './app_no_schedule');
  }
};

const HelpersNoHandler = {
  appPath: function () {
    return path.join(__dirname, './app_no_handler');
  }
};

const HelpersNoTasks = {
  appPath: function () {
    return path.join(__dirname, './app_no_tasks');
  }
};

const HelpersNoTasksDir = {
  appPath: function () {
    return path.join(__dirname, './app_no_tasks_dir');
  }
};

describe('Scheduler', function () {
  
  it('Should instantiate correctly', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(Helpers);
    expect(scheduler.tasksPath).to.equal(path.join(Helpers.appPath(), 'Tasks'));
    expect(scheduler.registeredTasks).to.eql([]);
  });

  it('Should run with good tasks', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(Helpers);
    scheduler.run();
    expect(typeof scheduler.registeredTasks).to.equal(typeof []);
    expect(scheduler.registeredTasks.length).to.equal(1);
  });

  it('Should ignore invalid task file types', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(HelpersBadTaskFile);
    expect(function () { scheduler.run() }).not.to.throw();
  });

  it('Should fail to run gracefully if task has no schedule property', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(HelpersNoSchedule);
    expect(function () { scheduler.run() }).to.throw();
  });

  it('Should fail to run gracefully if task has no handler', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(HelpersNoHandler);
    expect(function () { scheduler.run() }).to.throw();
  });

  it('Should fail to run gracefully if no task dir exists', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(HelpersNoTasksDir);
    scheduler.run()
    expect(function () { scheduler.run() }).not.to.throw();
  });

  it('Should fail to run gracefully if task dir is empty', function * () {
    this.timeout(0);
    const scheduler = new Scheduler(HelpersNoTasks);
    scheduler.run()
    expect(scheduler.registeredTasks.length).to.equal(0);
  });

});
