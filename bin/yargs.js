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
  )
  .command(
    'server',
    'creates mockup service',
    (y) => y.option('service', { alias: 's', type: 'string', demandOption: true })
      .option('http-port', { alias: 'h', type: 'number', demandOption: false })
      .option('ws-port', { alias: 'w', type: 'number', demandOption: false })
      .options('defs', { alias: 'd', type: 'string', demandOption: true, desc: 'path to json file or json strcture defining actions and results, e.g. \'[{"a":"getData","r":{"foo":"bar"}},{"a":"isValid","r":true}]\'' })
  )
  .demandCommand()
  .recommendCommands()
  .version(pkg.version)
  .help()

const cmds = ['lookup', 'request', 'server']

module.exports = { cmds, yargs }
