const {
  andThen,
  any,
  all,
  complement,
  defaultTo,
  hasPath,
  otherwise,
  pipe,
  tap,
  when,
  compose,
  propOr,
  either,
  isNil,
  isEmpty,
} = require('ramda')
const VError = require('verror')
const whoisJson = require('whois-json')

const { ERRORS } = require('./errors')
const logger = require('./logger')

// isNilOrEmpty :: Any -> Boolean
const isNilOrEmpty = either(isNil, isEmpty)

// lookup: String -> Promise
const lookup = domain =>
  whoisJson(domain, { follow: 3, timeout: 5000, verbose: true })
    .then(defaultTo([]))

// hasValidWhois :: Object -> Boolean
const hasValidWhois = any(hasPath([ 'data', 'registryDomainId' ]))

// hasInvalidWhois :: Object -> Boolean
const hasInvalidWhois = complement(hasValidWhois)

// logWhoisResults :: Object -> Object
const logWhoisResults = whois =>
  logger.debug('WHOIS results:', JSON.stringify(whois))

// throwError :: Error -> Error
const throwError = cause => {
  throw new VError({ name: ERRORS.WHOIS_ERROR, cause }, 'Failed to query WHOIS')
}

// throwEmptyWhoisError :: -> Error
const throwEmptyWhoisError = () => {
  throw new VError({ name: ERRORS.EMPTY_WHOIS }, 'Empty WHOIS results')
}

// hasEmptyData:: Object -> Boolean
const hasEmptyData = compose(isNilOrEmpty, propOr(null, 'data'))

// throwWhenEmptyWhois :: [ Object ] -> [ Object ]|Error
const throwWhenEmptyWhois = when(all(hasEmptyData), throwEmptyWhoisError)

// String -> Promise Boolean|Error
module.exports = pipe(
  lookup,
  andThen(tap(logWhoisResults)),
  andThen(tap(throwWhenEmptyWhois)),
  andThen(hasInvalidWhois),
  otherwise(throwError),
)
