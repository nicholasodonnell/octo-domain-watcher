const Joi = require('joi')
const { compose, head } = require('ramda')
const VError = require('verror')

const { ERRORS } = require('./errors')

// validate :: Object -> Object -> Promise Object|Error
const validate = schema => value =>
  schema.validateAsync(value, { abortEarly: false })

const appSchema = Joi.object({
  baseUrl: Joi.string().default('https://api.github.com'),
  labels: Joi.string().default('watch-domain'),
  repository: Joi.string().required(),
  token: Joi.string().required(),
}).required()

// invalidDomainError :: Object -> Error
const invalidDomainError = ({ value }) =>
  VError({ name: ERRORS.INVALID_DOMAIN_NAME }, `${value} is not a valid FQDN`)

const issueSchema = Joi.object({
  id: Joi.number().required(),
  number: Joi.number().required(),
  title: Joi.string().domain().required().error(compose(invalidDomainError, head)),
  user: Joi.object().keys({
    login: Joi.string().required(),
  }).required().unknown(),
}).required().unknown()

module.exports = {
  appSchema: validate(appSchema),
  issueSchema: validate(issueSchema),
}
