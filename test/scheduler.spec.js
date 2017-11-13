'use strict'

const path = require('path')
const Scheduler = require('../src/Scheduler')
const chai = require('chai')
const expect = chai.expect

describe('Scheduler', function () {

  /**
   * @param {String} projectName
   * @return {{appRoot: appRoot}}
   */
  function getHelpers (projectName) {
    return {
      appRoot: function () {
        return path.join(__dirname, `./projects/${projectName}`)
      }
    }
  }

  it('Should instantiate correctly', async () => {
    const Helpers = getHelpers('good')
    const scheduler = new Scheduler(Helpers)
    expect(scheduler.tasksPath).to.equal(path.join(Helpers.appRoot(), 'app', 'Tasks'))
    expect(scheduler.registeredTasks).to.eql([])
  })

  it('Should run with good tasks', () => {
    const Helpers = getHelpers('good')
    const scheduler = new Scheduler(Helpers)
    scheduler.run()
    expect(typeof scheduler.registeredTasks).to.equal(typeof [])
    expect(scheduler.registeredTasks.length).to.equal(1)
  })

  it('Should ignore invalid task file types', () => {
    const Helpers = getHelpers('badFile')
    const scheduler = new Scheduler(Helpers)
    expect(scheduler.run.bind(scheduler)).not.to.throw()
  })

  it('Should fail to run gracefully if task has no schedule property', () => {
    const Helpers = getHelpers('noSchedule')
    const scheduler = new Scheduler(Helpers)
    expect(scheduler.run.bind(scheduler)).to.throw()
  })

  it('Should fail to run gracefully if task has no handler', () => {
    const Helpers = getHelpers('noHandler')
    const scheduler = new Scheduler(Helpers)
    expect(scheduler.run.bind(scheduler)).to.throw()
  })

  it('Should fail to run gracefully if no task dir exists', () => {
    const Helpers = getHelpers('noTasksDir')
    const scheduler = new Scheduler(Helpers)
    expect(scheduler.run.bind(scheduler)).not.to.throw()
  })

  it('Should fail to run gracefully if task dir is empty', () => {
    const Helpers = getHelpers('noTasks')
    const scheduler = new Scheduler(Helpers)
    scheduler.run()
    expect(scheduler.registeredTasks.length).to.equal(0)
  })

})
