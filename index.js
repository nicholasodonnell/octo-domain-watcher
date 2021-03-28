const exit = require('exeunt')
const VError = require('verror')

const all = require('./lib/all')
const checkDomainForIssues = require('./lib/checkDomainForIssues')
const env = require('./lib/env')
const handleResponseForIssues = require('./lib/handleResponseForIssues')
const logger = require('./lib/logger')
const octokit = require('./lib/octokit')
const { appSchema } = require('./lib/schema')

// app :: Object -> Void
const app = async props => {
  try {
    logger.debug('Starting app with props', JSON.stringify(props))

    const { baseUrl, labels, repository, token } = await appSchema(props)

    const octo = octokit({ baseUrl, repository, token })

    const issues = await octo.fetchOpenIssues({ labels })

    await checkDomainForIssues(issues)
      .then(handleResponseForIssues(octo, issues))
      .then(all)

    logger.debug('Exiting app')
  } catch (e) {
    logger.error('App failed', VError.fullStack(e))

    exit(1)
  }
}

if (require.main === module) {
  app({
    baseUrl: env.GITHUB_API_URL,
    labels: env.INPUT_GITHUB_LABELS,
    repository: env.GITHUB_REPOSITORY,
    token: env.INPUT_GITHUB_TOKEN,
  })
}

module.exports = app
