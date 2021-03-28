const { tap, uncurryN } = require('ramda')

const logger = require('./logger')

// logDomainUnavailable :: [ Object ] -> [ Object ]
const logDomainUnavailable = tap(({ number, title }) =>
  logger.warn(
    `Domain "${title}" is unavailable - Not taking any action for issue #${number}`
  ))

// handleDomainUnavailable :: Object -> Object -> [ Promise Object|Void ]
const handleDomainUnavailable = uncurryN(2, octo =>
  logDomainUnavailable
)

module.exports = handleDomainUnavailable
