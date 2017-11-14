'use strict'

const path = require('path')
const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const { Helpers, Logger } = require('@adonisjs/sink')
const Scheduler = require('../src/Scheduler')

test.group('Scheduler', (group) => {
  /**
   * @param {String} name
   * @return {Helpers}
   */
  function getHelpers (name) {
    ioc.fake('Adonis/Src/Helpers', () => new Helpers(path.join(__dirname, `./projects/${name}`)))
    return ioc.use('Adonis/Src/Helpers')
  }

  group.before(() => {
    ioc.fake('Task', () => require('./../src/Scheduler/Task'))
    ioc.fake('Adonis/Src/Logger', () => new Logger())
  })

  test('Should instantiate correctly', (assert) => {
    const Helpers = getHelpers('good')
    const scheduler = new Scheduler(Helpers)
    assert.equal(scheduler.tasksPath, path.join(Helpers.appRoot(), 'app', 'Tasks'))
    assert.deepEqual(scheduler.registeredTasks, [])
  })

  test('Should run with good tasks', async (assert) => {
    const Helpers = getHelpers('good')
    const scheduler = new Scheduler(Helpers)
    await scheduler.run()
    assert.isArray(scheduler.registeredTasks)
    assert.equal(scheduler.registeredTasks.length, 1)
  })

  test('Should ignore invalid task file types', async (assert) => {
    const Helpers = getHelpers('badFile')
    const scheduler = new Scheduler(Helpers)

    try {
      await scheduler.run()
      assert.isTrue(true)
    } catch (e) {
      assert.isTrue(false)
    }
  })

  test('Should fail to run gracefully if task has no schedule property', async (assert) => {
    const Helpers = getHelpers('noSchedule')
    const scheduler = new Scheduler(Helpers)

    try {
      await scheduler.run()
      assert.isTrue(false)
    } catch (e) {
      assert.isTrue(true)
    }
  })

  test('Should fail to run gracefully if task has no handler', async (assert) => {
    const Helpers = getHelpers('noHandler')
    const scheduler = new Scheduler(Helpers)

    try {
      await scheduler.run()
      assert.isTrue(false)
    } catch (e) {
      assert.isTrue(true)
    }
  })

  test('Should fail to run gracefully if no task dir exists', async (assert) => {
    const Helpers = getHelpers('noTasksDir')
    const scheduler = new Scheduler(Helpers)

    try {
      await scheduler.run()
      assert.isTrue(false)
    } catch (e) {
      assert.isTrue(true)
    }
  })

  test('Should fail to run gracefully if task dir is empty', async (assert) => {
    const Helpers = getHelpers('noTasks')
    const scheduler = new Scheduler(Helpers)

    try {
      await scheduler.run()
      assert.isTrue(false)
    } catch (e) {
      assert.isTrue(true)
    }
  })
})
