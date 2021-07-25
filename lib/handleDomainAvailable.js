const dateFormat = require('dateformat')
const { curry, juxt, otherwise, pipe, tap, uncurryN } = require('ramda')
const VError = require('verror')

const all = require('./all')
const logger = require('./logger')

// logDomainAvailable :: [ Object ] -> [ Object ]
const logDomainAvailable = tap(({ number, title }) =>
  logger.success(
    `Domain "${title}" is available - Sending domain available message and closing issue #${number}`
  ))

// commentDomainAvailable :: Object -> Object -> Promise Object
const commentDomainAvailable = curry((octo, { number, user, title }) =>
  octo.commentOnIssue({
    body:
    `Hi @${user.login} \n\n` +
    `Great news! Your domain [${title}](http://${title}) appeared **available** on ` +
    `**${dateFormat(new Date(), 'dddd mmmm dS yyyy, h:MM:ss TT', true)} UTC** :tada:`,
    number,
  })
)

// logAndContinue :: Error -> Void
const logErrorAndContinue = e => {
  const error = new VError(e, 'Failed to send domain available message and/or close issue')

  logger.error(error.message)
}

// handleDomainAvailable :: Object -> Object -> [ Promise Object|Void ]
const handleDomainAvailable = uncurryN(2, octo =>
  pipe(
    logDomainAvailable,
    juxt([
      commentDomainAvailable(octo),
      octo.closeIssue,
    ]),
    all,
    otherwise(logErrorAndContinue),
  )
)

module.exports = handleDomainAvailable
