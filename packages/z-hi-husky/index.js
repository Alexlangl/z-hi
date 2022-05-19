module.exports = {
  hooks: {
    'pre-commit': 'link-staged',
    "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS"
  }
}