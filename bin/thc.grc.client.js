#!/usr/bin/env node

'use strict'

process.argv[1] = 'thc-grc-client' // fix usage name in yargs

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const { GrcHttpClient, GrcWsClient } = require('@thrivecoin/grc-client')
const { GrcHttpWrk, GrcWsWrk, GrcHttpWsWrk } = require('@thrivecoin/grc-server')
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

  if (cmd === 'server') {
    const httpPort = +argv['http-port']
    const wsPort = +argv['ws-port']

    if (!httpPort && !wsPort) {
      throw new Error('ERR_PORT_PARAMS_REQUIRED')
    }

    /** @type {Array<{ a: string, r: any }>} */
    let defs = null
    try {
      defs = JSON.parse(argv.defs)
    } catch (err) {
      try {
        defs = JSON.parse(fs.readFileSync(path.normalize(argv.defs), 'utf-8'))
      } catch (err) {
        throw new Error('ERR_DEFS_INVALID')
      }
    }

    if (!Array.isArray(defs) || !defs.length || !defs.every(d => typeof d.a === 'string' && d.r !== undefined)) {
      throw new Error('ERR_DEFS_INVALID_STRUCTURE')
    }

    /** @type {GrcHttpWrk|GrcWsWrk|GrcHttpWsWrk} */
    let BaseClass
    const constructorArgs = { grape: argv.grape, name: argv.service }
    if (httpPort && wsPort) {
      BaseClass = GrcHttpWsWrk
      constructorArgs.ports = [httpPort, wsPort]
    } else if (wsPort) {
      BaseClass = GrcWsWrk
      constructorArgs.port = wsPort
    } else {
      BaseClass = GrcHttpWrk
      constructorArgs.port = httpPort
    }

    const wrk = new class ImplClass extends BaseClass {
      constructor (args) {
        super(args)

        defs.forEach(d => {
          this[d.a] = () => d.r
        })
      }
    }(constructorArgs)
    await wrk.start()
    console.log(`server started listening to service ${wrk._names?.join(',') || wrk._name} on port ${wrk._ports?.join(',') || wrk._port}`)
    console.log('definitions:')
    console.table(defs.map(d => ({ Action: d.a, Result: typeof d.r === 'object' && d.r !== null ? JSON.stringify(d.r) : d.r })))
  }

  httpClient.stop()
  wsClient.stop()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
