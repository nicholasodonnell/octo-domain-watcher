const dateFormat = require('dateformat')
const {
  andThen,
  otherwise,
  pipe,
  tap,
} = require('ramda')
const VError = require('verror')

const logger = require('./logger')

// logDomainAvailable :: [ Object ] -> [ Object ]
const logDomainAvailable = ({ number, title }) => () =>
  logger.success(
    `Domain "${title}" is available - Sending domain available message and closing issue #${number}`,
  )

// commentDomainAvailable :: Object -> Object -> Promise Object
const commentDomainAvailable = (octo, { number, user, title }) => () =>
  octo.commentOnIssue({
    body:
    `Hi @${user.login} \n\n` +
    `Great news! Your domain [${title}](http://${title}) appeared **available** on ` +
    `**${dateFormat(new Date(), 'dddd mmmm dS yyyy, h:MM:ss TT', true)} UTC** :tada:`,
    number,
  })

// closeIssue :: Object -> Object -> Promise
const closeIssue = (octo, { number }) => () =>
  octo.closeIssue({ number })

// logError :: Error -> Void
const logError = e => {
  const error = new VError(e, 'Failed to send domain available message and/or close issue')

  logger.error(error.message)
}

// Object -> Object -> Promise
module.exports = (octo, issue) =>
  pipe(
    tap(logDomainAvailable(issue)),
    commentDomainAvailable(octo, issue),
    andThen(closeIssue(octo, issue)),
    otherwise(logError),
  )
