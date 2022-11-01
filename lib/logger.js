const chalk = require('chalk')
const { compose, uncurryN } = require('ramda')

const log = uncurryN(2, chlk =>
  compose(console.log, chlk),
)

module.exports = {
  debug: log(chalk.dim),
  error: log(chalk.red),
  info: log(chalk.blue),
  success: log(chalk.green),
  warn: log(chalk.yellow),
}
