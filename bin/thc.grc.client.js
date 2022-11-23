#!/usr/bin/env node

'use strict'

process.argv[1] = 'thc-grc-client' // fix usage name in yargs

const _ = require('lodash')
const { GrcHttpClient, GrcWsClient } = require('@thrivecoin/grc-client')
const { cmds, yargs } = require('./yargs')
const { inspect } = require('util')

const printRes = (res) => {
  console.log(inspect(res, false, 1000, true))
}

const main = async () => {
  const argv = yargs.argv
  const [cmd] = argv._
  if (!cmds.includes(cmd)) throw new Error('ERR_CMD_NOT_SUPPORTED')

  const httpClient = new GrcHttpClient({ grape: argv.grape, timeout: argv.timeout })
  httpClient.start()
  const wsClient = new GrcWsClient({ grape: argv.grape, timeout: argv.timeout })
  wsClient.start()

  if (cmd === 'lookup') {
    const res = await new Promise((resolve, reject) => httpClient._link.lookup(
      argv.service, {}, (err, res) => err ? reject(err) : resolve(res)
    ))
    printRes(res)
  }

  if (cmd === 'request') {
    if (!argv.action) throw new Error('ERR_ACTION_PARAM_INVALID')
    if (!_.isString(argv.payload)) throw new Error('ERR_PAYLOAD_PARAM_INVALID')

    const payload = JSON.parse(argv.payload)
    if (!Array.isArray(payload)) throw new Error('ERR_PAYLOAD_PARAM_INVALID')

    const client = argv.transport === 'http' ? httpClient : wsClient
    const res = await client.request(argv.service, argv.action, payload)
    printRes(res)
  }

  httpClient.stop()
  wsClient.stop()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
