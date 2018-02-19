# Adonis Scheduler Provider

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

This library provides an easy way to schedule recurring tasks for AdonisJS v4.

> Use branch [adonis-v3](https://github.com/nrempel/adonis-scheduler/tree/adonis-v3) for AdonisJS version 3

## Install

```
npm install --save adonis-scheduler
```

## Configure

Register it in `start/app.js`:

```javascript
const providers = [
  ...
  'adonis-scheduler/providers/SchedulerProvider'
]

const aliases = {
  ...
  Scheduler: 'Adonis/Addons/Scheduler'
}
```

Register the commands:

```javascript
const aceProviders = [
  ...
  'adonis-scheduler/providers/CommandsProvider'
]
```

## Usage

### Starting the scheduler

Starting an instance of the kue listener is easy with the included ace command. Simply run `node ace run:scheduler`.

The provider looks for jobs in the `app/Tasks` directory of your AdonisJS project and will automatically register a handler for any tasks that it finds.

### Creating your first task

Jobs are easy to create. Run `node ace make:task Example`. They expose the following properties:

| Name        | Required | Type      | Static | Description                                           |
|-------------|----------|-----------|--------|--------------------------------------------------------|
| schedule    | true     | many      | true   | The schedule for which the task should run. [More docs.](https://github.com/node-schedule/node-schedule#cron-style-scheduling)      |
| handle      | true     | function  | false  | A function that is called for this task.               |

## Thanks

Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.

[appveyor-image]: https://img.shields.io/appveyor/ci/nrempel/adonis-scheduler/master.svg?style=flat-square

[appveyor-url]: https://ci.appveyor.com/project/nrempel/adonis-scheduler

[npm-image]: https://img.shields.io/npm/v/adonis-scheduler.svg?style=flat-square
[npm-url]: https://npmjs.org/package/adonis-scheduler

[travis-image]: https://img.shields.io/travis/nrempel/adonis-scheduler/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/nrempel/adonis-scheduler

[coveralls-image]: https://img.shields.io/coveralls/nrempel/adonis-scheduler/develop.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/nrempel/adonis-scheduler
