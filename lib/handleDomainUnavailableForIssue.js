const logger = require('./logger')

// logDomainUnavailable :: Object -> Void
const logDomainUnavailable = ({ number, title }) =>
  logger.warn(
    `Domain "${title}" is unavailable - Not taking any action for issue #${number}`,
  )

// Object -> Object -> Void
module.exports = (_, issue) => () =>
  logDomainUnavailable(issue)
