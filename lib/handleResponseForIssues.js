const { both, compose, cond, equals, F, T, type, uncurryN, zipWith } = require('ramda')

const handleDomainAvailable = require('./handleDomainAvailable')
const handleDomainInvalid = require('./handleDomainInvalid')
const handleDomainUnavailable = require('./handleDomainUnavailable')

// isType :: Primitive -> Boolean
const isType = t => compose(equals(t.name), type)

// isTruthy :: Boolean -> Boolean
const isTruthy = equals(true)

// isFalsey :: Boolean -> Boolean
const isFalsey = equals(false)

// isFalsey :: Boolean|Error -> Boolean
const isDomainAvailable = both(isType(Boolean), isTruthy)

// isFalsey :: Boolean|Error -> Boolean
const isDomainInvalid = isType(Object)

// isFalsey :: Boolean|Error -> Boolean
const isDomainUnavailable = both(isType(Boolean), isFalsey)

// checkDomainForIssue :: Object -> Object -> Boolean|Error -> Promise Function
const handleResponseForIssue = uncurryN(3, (octo, issue) =>
  cond([
    [ isDomainAvailable,   () => handleDomainAvailable(octo, issue) ],
    [ isDomainUnavailable, () => handleDomainUnavailable(octo, issue) ],
    [ isDomainInvalid,     error => handleDomainInvalid(octo, error, issue) ],
    [ T,                   F ],
  ])
)

// handleResponseForIssues :: [ Object ] -> [ Boolean|Error ] -> [ Promise Object ]
const handleResponseForIssues = uncurryN(2, octo =>
  zipWith(
    handleResponseForIssue(octo)
  )
)

module.exports = handleResponseForIssues
