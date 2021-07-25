const { andThen, compose, isNil, otherwise, pipe, prop, tap } = require('ramda')
const VError = require('verror')
const whoisJson = require('whois-json')

const logger = require('./logger')

// logWhoisResults :: Object -> Boolean
const hasInvalidWhois = compose(isNil, prop('domainName'))

// logWhoisResults :: Object -> Object
const logWhoisResults = tap(whois =>
  logger.debug('WHOIS results:', JSON.stringify(whois))
)

// logErrorAndThrow :: Error -> Throw
const logErrorAndThrow = e => {
  const error = new VError(e, 'Failed to check domain availability')
  logger.error(error.message)

  throw error
}

// checkDomainAvailable :: String -> Boolean|Throw
const checkDomainAvailable = pipe(
  whoisJson,
  andThen(logWhoisResults),
  andThen(hasInvalidWhois),
  otherwise(logErrorAndThrow),
)

module.exports = checkDomainAvailable
