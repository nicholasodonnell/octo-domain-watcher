const Joi = require('joi')
const { compose, curry, head } = require('ramda')
const VError = require('verror')

// validate :: Object -> Object -> Promise Object|Throw
const validate = curry((schema, value ) =>
  schema.validateAsync(value, { abortEarly: false })
)

const appSchema = Joi.object({
  baseUrl: Joi.string().default('https://api.github.com'),
  labels: Joi.string().default('watch-domain'),
  repository: Joi.string().required(),
  token: Joi.string().required(),
}).required()

// invalidDomainError :: Object -> Error
const invalidDomainError = ({ value }) =>
  VError(`${value} is not a valid domain`)

const issueSchema = Joi.object({
  id: Joi.number().required(),
  number: Joi.number().required(),
  title: Joi.string().domain().required().error(compose(invalidDomainError, head)),
}).required().unknown()

module.exports = {
  appSchema: validate(appSchema),
  issueSchema: validate(issueSchema),
}
