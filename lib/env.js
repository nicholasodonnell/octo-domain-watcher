const exit = require('exeunt')
const { concat, difference, join, keys, pick } = require('ramda')
const VError = require('verror')

const logger = require('./logger')

const required = [
  'GITHUB_REPOSITORY',
  'INPUT_GITHUB_TOKEN',
]

const optional = [
  'GITHUB_API_URL',
  'INPUT_GITHUB_LABELS',
]

const missing = difference(required, keys(process.env))

const vars = concat(required, optional)

const vals = pick(vars, process.env)

module.exports = new Proxy(vals, {
  get (obj, prop) {
    if (missing.length > 0) {
      const error = new VError(`Missing environment variables: ${join(', ', missing)}`)
      logger.error(error.message)

      exit(1)
    }

    return obj[prop]
  },
})
