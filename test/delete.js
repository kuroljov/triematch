// @flow
'use strict'

const t = require('tap')
const Store = require('../src/Trie')
const $ = require('./lib/state')

t.test('delete', t => {
  t.test('unexisting thing', t => {
    const store = new Store()
    $.feed(store)

    store.delete('Not in here at all')
    t.notOk(store.delete('unexisting thing'))
    t.equal(store.match($.Michael).length, $.state.size)

    t.end()
  })

  t.test('alone', t => {
    const store = new Store()
    store.set($.MichaelJimenez, $.state.get($.MichaelJimenez))
    store.delete($.MichaelJimenez)
    t.equal(store.size, 0)
    t.notOk(store.get($.MichaelJimenez))
    t.equal(store.match($.MichaelJimenez).length, 0)
    t.deepEqual(store.rootSocket, {})

    t.end()
  })

  t.test('node in the same branch', t => {
    const store = new Store()

    store.set($.MichaelJones, $.state.get($.MichaelJones))
    store.set($.MichaelJoneson, $.state.get($.MichaelJoneson))

    store.delete($.MichaelJones)

    t.notOk(store.get($.MichaelJones))
    t.ok(store.get($.MichaelJoneson))
    t.equal(store.match($.Michael).length, 1)

    t.end()
  })

  t.test('leaf in the same branch', t => {
    const store = new Store()

    store.set($.MichaelJones, $.state.get($.MichaelJones))
    store.set($.MichaelJoneson, $.state.get($.MichaelJoneson))

    store.delete($.MichaelJoneson)

    t.notOk(store.get($.MichaelJoneson))
    t.ok(store.get($.MichaelJones))
    t.equal(store.match($.Michael).length, 1)

    t.end()
  })

  t.test('fork', t => {
    const store = new Store()

    store.set($.Michael, $.state.get($.Michael))
    store.set($.MichaelJones, $.state.get($.MichaelJones))
    store.set($.MichaelJoneson, $.state.get($.MichaelJoneson))

    store.delete($.Michael)

    t.notOk(store.get($.Michael))
    t.ok(store.get($.MichaelJones))
    t.ok(store.get($.MichaelJoneson))
    t.equal(store.match($.Michael).length, 2)

    t.end()
  })

  t.test('leaf after fork', t => {
    const store = new Store()

    store.set($.Michael, $.state.get($.Michael))
    store.set($.MichaelJones, $.state.get($.MichaelJones))
    store.set($.MichaelJoneson, $.state.get($.MichaelJoneson))

    store.delete($.MichaelJoneson)

    t.notOk(store.get($.MichaelJoneson))
    t.ok(store.get($.Michael))
    t.ok(store.get($.MichaelJones))
    t.equal(store.match($.Michael).length, 2)

    t.end()
  })

  t.test('node after fork', t => {
    const store = new Store()

    store.set($.Michael, $.state.get($.Michael))
    store.set($.MichaelJones, $.state.get($.MichaelJones))
    store.set($.MichaelJoneson, $.state.get($.MichaelJoneson))

    store.delete($.MichaelJones)

    t.notOk(store.get($.MichaelJones))
    t.ok(store.get($.Michael))
    t.ok(store.get($.MichaelJoneson))
    t.equal(store.match($.Michael).length, 2)

    t.end()
  })

  t.end()
})
