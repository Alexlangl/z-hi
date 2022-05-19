module.exports = {
  extends: [
    "@commitlint/config-conventional"
  ],
  // 以下时我们自定义的规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'revert',
        'merge'
      ]
    ]
  }
};
