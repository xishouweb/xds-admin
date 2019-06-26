'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOBILE_BASE_URL: '"http://localhost:8080"',
  CHAT_BASE_URL: '"http://localhost:9999"',
  API_ROOT: '""',
  SELF_BASE_URL: '"https://xiaodashi.com"',
})
