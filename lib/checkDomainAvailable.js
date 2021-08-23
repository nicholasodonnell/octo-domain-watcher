const {
  always,
  andThen,
  compose,
  either,
  identity,
  ifElse,
  isEmpty,
  isNil,
  otherwise,
  pipe,
  prop,
  tap,
} = require('ramda')
const VError = require('verror')
const whoisJson = require('whois-json')

const logger = require('./logger')

// throwError :: Error -> Throw Error
const throwError = e => { throw e }

// isNilOrEmpty :: Any -> Boolean
const isNilOrEmpty = either(isNil, isEmpty)

// queryWhois :: (String, Number) -> Object|Throw
const queryWhois = async (domain, calls = 1) =>
  whoisJson(domain)
    .then(ifElse(
      both(isNilOrEmpty, always(calls < 3)),
      () => queryWhois(domain, ++calls),
      identity,
    ))
    .catch(ifElse(
      always(calls < 3),
      () => queryWhois(domain, ++calls),
      throwError,
    ))

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
  queryWhois,
  andThen(logWhoisResults),
  andThen(hasInvalidWhois),
  otherwise(logErrorAndThrow),
)

module.exports = checkDomainAvailable
