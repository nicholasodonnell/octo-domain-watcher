const {
  andThen,
  otherwise,
  pipe,
  tap,
} = require('ramda')
const VError = require('verror')

const logger = require('./logger')

// logError :: [ Object ] -> [ Object ]
const logDomainInvalid = ({ number, title }) => e =>
  logger.error(
    `Domain "${title}" is invalid - Sending domain invalid message and closing issue #${number}`,
  )

// commentDomainInvalid :: Object -> Object -> Promise Object
const commentDomainInvalid = (octo, { number, user, title }) => e =>
  octo.commentOnIssue({
    body:
    `Hi @${user.login} \n\n` +
    `Sorry but something went wrong checking if \`${title}\` is available: \`${e.message}\`. \n\n` +
    `Please fix any problems and re-open this issue. ` +
    `If you continue to have problems please contact my owner.`,
    number,
  })

// closeIssue :: Object -> Object -> Promise
const closeIssue = (octo, { number }) => () =>
  octo.closeIssue({ number })

// logError :: Error -> Void
const logError = e => {
  const error = new VError(e, 'Failed to send domain invalid message and/or close issue')

  logger.error(error.message)
}

// Object -> Object -> Promise
module.exports = (octo, issue) =>
  pipe(
    tap(logDomainInvalid(issue)),
    commentDomainInvalid(octo, issue),
    andThen(closeIssue(octo, issue)),
    otherwise(logError),
  )
