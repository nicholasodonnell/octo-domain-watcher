const exit = require('exeunt')
const { cond, equals, T } = require('ramda')
const VError = require('verror')

const checkDomainForIssue = require('./lib/checkDomainForIssue')
const env = require('./lib/env')
const { isEmptyWhoisError, isInvalidDomainError } = require('./lib/errors')
const handleDomainAvailableForIssue = require('./lib/handleDomainAvailableForIssue')
const handleDomainUnavailableForIssue = require('./lib/handleDomainUnavailableForIssue')
const handleInvalidDomainForIssue = require('./lib/handleInvalidDomainForIssue')
const handleUnsupportedDomainForIssue = require('./lib/handleUnsupportedDomainForIssue')
const logger = require('./lib/logger')
const octokit = require('./lib/octokit')
const { appSchema } = require('./lib/schema')

// isTruthy :: Boolean -> Boolean
const isAvailable = equals(true)

// isFalsey :: Boolean -> Boolean
const isUnavailable = equals(false)

// logUnhandledError :: Error -> Void
const logUnhandledErrorForIssue = issue => cause => {
  const error = new VError({ cause, info: { issue } }, 'Unhandled error')

  logger.error(error.message)
}

// app :: Object -> Void
const app = async props => {
  try {
    logger.debug('Starting app with props', JSON.stringify(props))

    const { baseUrl, labels, repository, token } = await appSchema(props)
    const octo = octokit({ baseUrl, repository, token })
    const issues = await octo.fetchOpenIssues({ labels })

    for (const issue of issues) {
      await checkDomainForIssue(issue)
        .then(cond([
          [ isAvailable,    handleDomainAvailableForIssue(octo, issue) ],
          [ isUnavailable,  handleDomainUnavailableForIssue(octo, issue) ],
        ]))
        .catch(cond([
          [ isInvalidDomainError, handleInvalidDomainForIssue(octo, issue) ],
          [ isEmptyWhoisError,    handleUnsupportedDomainForIssue(octo, issue) ],
          [ T,                    logUnhandledErrorForIssue(issue) ],
        ]))
    }

    logger.debug('Exiting app')
  } catch (e) {
    logger.error('App failed', VError.fullStack(e))

    exit(1)
  }
}

if (require.main === module) {
  app({
    baseUrl: env.GITHUB_API_URL,
    labels: env.INPUT_GITHUB_LABELS,
    repository: env.GITHUB_REPOSITORY,
    token: env.INPUT_GITHUB_TOKEN,
  })
}

module.exports = app
