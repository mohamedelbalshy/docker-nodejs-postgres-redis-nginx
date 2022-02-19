'use strict'

const express = require('express')
const { createClient } = require('redis')
const { Client } = require('pg')

// Constants
const PORT = 3000
const HOST = '0.0.0.0'

// App
const app = express()
app.get('/', (req, res) => {
  ;(async () => {
    const client = createClient({ url: 'redis://redis:6379' })
    const psqlClient = new Client({
      user: 'postgres',
      database: 'postgres',
      host: 'postgres',
      port: 5432,
      password: 'postgres',
    })

    await psqlClient.connect()
    const now = await psqlClient.query('select NOW()')
    console.log(now.rows[0].now, ', from postgres')
    client.on('error', (err) => console.log('Redis Client Error', err))

    await client.connect()

    await client.set('key', 'value')
    const value = await client.get('key')
    console.log(value)
  })()
  res.send('Hello World')
})

app.get('/api', (req, res, next) => {
  return res.send('Ok')
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
