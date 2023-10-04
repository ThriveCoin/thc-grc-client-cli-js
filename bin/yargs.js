'use strict'

const pkg = require('../package.json')

const yargs = require('yargs')
  .option('grape', { alias: 'g', type: 'string', desc: 'grape dht url', default: 'http://127.0.0.1:30001', demandOption: true })
  .option('timeout', { alias: 't', type: 'number', desc: 'grape timeout [ms]', default: 30000, demandOption: true })
  .command(
    'lookup',
    'lookups for a service',
    (y) => y.option('service', { alias: 's', type: 'string', demandOption: true })
  )
  .command(
    'request',
    'makes a request to the service',
    (y) => y.option('service', { alias: 's', type: 'string', demandOption: true })
      .option('action', { alias: 'a', type: 'string', demandOption: true })
      .option('payload', { alias: 'p', type: 'string', demandOption: true })
      .option('transport', { default: 'http', choices: ['http', 'ws'], demandOption: true })
      .option('out', { default: 'console', demandOption: true })
  )
  .demandCommand()
  .recommendCommands()
  .version(pkg.version)
  .help()

const cmds = ['lookup', 'request']

module.exports = { cmds, yargs }
