const VError = require('verror')

const ERRORS = Object.freeze({
  EMPTY_WHOIS: 'EMPTY_WHOIS',
  FAILED_DOMAIN_CHECK: 'FAILED_DOMAIN_CHECK',
  INVALID_DOMAIN_NAME: 'INVALID_DOMAIN_NAME',
  WHOIS_ERROR: 'WHOIS_ERROR',
})

// errorWithName :: String -> Boolean
const errorWithName = name => e =>
  VError.hasCauseWithName(e, name)

module.exports = {
  ERRORS,
  isEmptyWhoisError: errorWithName(ERRORS.EMPTY_WHOIS),
  isInvalidDomainError: errorWithName(ERRORS.INVALID_DOMAIN_NAME),
}
