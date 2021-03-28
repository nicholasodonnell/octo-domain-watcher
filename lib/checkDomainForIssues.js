const { andThen, compose, identity, map, otherwise, pipe, prop, tap } = require('ramda')

const all = require('./all')
const domainAvailable = require('./domainAvailable')
const logger = require('./logger')
const { issueSchema } = require('./schema')

// logCheckingIssues :: [ Object ] -> [ Object ]
const logCheckingIssues = tap(issues =>
  logger.info(`Checking ${issues.length} issue(s)`)
)

// logIssues :: Object -> Object
const logCheckingIssue = tap(({ number, title }) =>
  logger.info(`Checking domain "${title}" for issue #${number}`)
)

// checkDomainAvailableForIssue :: Object -> Promise Boolean|Throw
const checkDomainAvailableForIssue = compose(domainAvailable, prop('title'))

// checkDomainForIssue :: Object -> Promise Boolean|Error
const checkDomainForIssue = pipe(
  logCheckingIssue,
  issueSchema,
  andThen(checkDomainAvailableForIssue),
  otherwise(identity),
)

// checkDomainForIssues :: [ Object ] -> Promise [ Boolean|Error ]
const checkDomainForIssues = pipe(
  logCheckingIssues,
  map(checkDomainForIssue),
  all,
)

module.exports = checkDomainForIssues
