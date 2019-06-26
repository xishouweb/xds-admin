'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  MOBILE_BASE_URL: '"http://xdstest.xingke100.com"', // 测试
  CHAT_BASE_URL: '"http://chattest.xingke100.com"',
  API_ROOT: '"http://apitest.xingke100.com"',
  SELF_BASE_URL: '"http://xdstest.xingke100.com"'
})
