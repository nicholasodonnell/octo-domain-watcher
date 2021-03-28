const { curry, juxt, otherwise, pipe, tap, uncurryN } = require('ramda')
const VError = require('verror')

const all = require('./all')
const logger = require('./logger')

// logDomainInvalid :: [ Object ] -> [ Object ]
const logDomainInvalid = tap(({ number, title }) =>
  logger.error(
    `Domain "${title}" is not a valid domain - Sending domain invalid message and closing issue #${number}`
  ))

// commentDomainInvalid :: Object -> Object -> Promise Object
const commentDomainInvalid = curry((octo, error, { number, user, title }) =>
  octo.commentOnIssue({
    body:
    `Hi @${user.login} \n\n` +
    `Sorry but something went wrong checking if \`${title}\` is available: \`${error.message}\`. \n\n` +
    `Please fix any problems and re-open this issue. ` +
    `If you continue to have problems please contact my owner.`,
    number,
  })
)

// logAndContinue :: Error -> Void
const logErrorAndContinue = e => {
  const error = new VError(e, 'Failed to send domain invalid message and/or close issue')

  logger.error(error.message)
}

// handleDomainInvalid :: Object -> Object -> [ Promise Object|Void ]
const handleDomainInvalid = uncurryN(3, (octo, error) =>
  pipe(
    logDomainInvalid,
    juxt([
      commentDomainInvalid(octo, error),
      octo.closeIssue,
    ]),
    all,
    otherwise(logErrorAndContinue),
  )
)

module.exports = handleDomainInvalid
