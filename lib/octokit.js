const { Octokit } = require('@octokit/rest')
const { compose, head, last, split } = require('ramda')

const meta = require('../package.json')

// getOwner :: String -> String
const getOwner = compose(head, split('/'))

// getRepo :: String -> String
const getRepo = compose(last, split('/'))

module.exports = ({ baseUrl, repository, token }) => {
  const octo = new Octokit({
    auth: token,
    baseUrl,
    userAgent: `${meta.name} v${meta.version}`,
  })
  const owner = getOwner(repository)
  const repo = getRepo(repository)

  // closeIssue :: Object -> Promise Object
  const closeIssue = ({ number }) =>
    octo.issues.update({ issue_number: number, owner, repo, state: 'closed' })

  // commentOnIssue :: Object -> Promise Object
  const commentOnIssue = ({ body, number }) =>
    octo.issues.createComment({ body, issue_number: number, owner, repo })

  // fetchOpenIssues :: Object -> Promise Object
  const fetchOpenIssues = ({ labels }) =>
    octo.paginate(octo.issues.listForRepo, { labels, owner, repo, state: 'open' })

  // lockIssue :: Object -> Promise Object
  const lockIssue = ({ number, reason }) =>
    octo.issues.lock({ issue_number: number, lock_reason: reason, owner, repo })

  return {
    closeIssue,
    commentOnIssue,
    fetchOpenIssues,
    lockIssue,
  }
}
