const {
  andThen,
  compose,
  otherwise,
  pipe,
  prop,
  tap,
} = require('ramda')
const VError = require('verror')

const checkDomainAvailability = require('./checkDomainAvailability')
const { ERRORS } = require('./errors')
const logger = require('./logger')
const { issueSchema } = require('./schema')

// logIssues :: Object -> Object
const logCheckingIssue = ({ number, title }) =>
  logger.info(`Checking domain "${title}" for issue #${number}`)

// checkDomainAvailabilityForIssue :: Object -> Promise Boolean|Error
const checkDomainAvailabilityForIssue = compose(checkDomainAvailability, prop('title'))

// throwError :: Error -> Error
const throwError = cause => {
  throw new VError({ name: ERRORS.FAILED_DOMAIN_CHECK, cause }, 'Failed to check domain')
}

// Object -> Promise Boolean|Error
module.exports = pipe(
  tap(logCheckingIssue),
  issueSchema,
  andThen(checkDomainAvailabilityForIssue),
  otherwise(throwError),
)
