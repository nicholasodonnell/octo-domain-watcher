const {
  andThen,
  otherwise,
  pipe,
  tap,
} = require('ramda')
const VError = require('verror')

const logger = require('./logger')

// logError :: [ Object ] -> [ Object ]
const logDomainUnsupported = ({ number, title }) => e =>
  logger.error(
    `Domain "${title}" is unsupported - Sending domain unsupported message and closing issue #${number}`,
  )

// commentDomainUnsupported :: Object -> Object -> Promise Object
const commentDomainUnsupported = (octo, { number, user, title }) => e =>
  octo.commentOnIssue({
    body:
    `Hi @${user.login} \n\n` +
    `Sorry - the domain \`${title}\` is not supported. ` +
    `Please try again with a different domain name.\n\n` +
    `<sub>Pull requests are welcome 🐙</sub>`,
    number,
  })

// closeIssue :: Object -> Object -> Promise
const closeIssue = (octo, { number }) => () =>
  octo.closeIssue({ number })

// logError :: Error -> Void
const logError = e => {
  const error = new VError(e, 'Failed to send domain unsupported message and/or close issue')

  logger.error(error.message)
}

// Object -> Object -> Promise
module.exports = (octo, issue) =>
  pipe(
    tap(logDomainUnsupported(issue)),
    commentDomainUnsupported(octo, issue),
    andThen(closeIssue(octo, issue)),
    otherwise(logError),
  )
