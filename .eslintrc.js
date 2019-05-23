module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  plugins: ["ember"],
  extends: ["eslint:recommended", "plugin:ember/recommended"],
  env: {
    browser: true
  },
  rules: {
    "no-console": "off",
    "no-side-effects": "off",
    "no-unused-vars": "off"
  },
  globals: {
    moment: true,
    logoutUser: true,
    lookup: true,
    expect: true,
    equal: true,
    QUnit: true,
    cordova: true,
    Twilio: true
  },
  overrides: [
    // node files
    {
      files: [
        "testem.js",
        "ember-cli-build.js",
        "config/**/*.js",
        "lib/*/index.js"
      ],
      parserOptions: {
        sourceType: "script",
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    },

    // test files
    {
      files: ["tests/**/*.js"],
      excludedFiles: ["tests/dummy/**/*.js"],
      env: {
        embertest: true
      }
    }
  ]
};