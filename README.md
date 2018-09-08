# GoodCity ADMIN App
[![Circle CI](https://circleci.com/gh/crossroads/admin.goodcity.svg?style=svg)](https://circleci.com/gh/crossroads/admin.goodcity)
[![Code Climate](https://codeclimate.com/github/crossroads/admin.goodcity/badges/gpa.svg)](https://codeclimate.com/github/crossroads/admin.goodcity)
[![Issue Count](https://codeclimate.com/github/crossroads/admin.goodcity/badges/issue_count.svg)](https://codeclimate.com/github/crossroads/admin.goodcity)
[![Test Coverage](https://codeclimate.com/github/crossroads/admin.goodcity/badges/coverage.svg)](https://codeclimate.com/github/crossroads/admin.goodcity) [![Greenkeeper badge](https://badges.greenkeeper.io/crossroads/admin.goodcity.svg)](https://greenkeeper.io/)

The GoodCity initiative is a new way to donate quality goods in Hong Kong. See www.goodcity.hk for more details.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Yarn](https://yarnpkg.com/)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

Install and configure nodejs https://github.com/creationix/nvm#install-script


* yarn add bower ember-cli phantomjs-prebuilt
* git clone https://github.com/crossroads/shared.goodcity.git
* cd shared.goodcity
* yarn link
* cd ..
* git clone https://github.com/crossroads/admin.goodcity.git
* cd admin.goodcity
* yarn link shared-goodcity
* ember install


## Running

* `yarn start`
* Visit your app at http://localhost:4201.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `yarn build`
* `EMBER_CLI_CORDOVA=0 ember build --environment=production`

## Deployment

Deployment will be automatic from CircleCI. To deploy to the live site, simply push to the live branch and CircleCI will do the rest.

If you wish to run the deployment manually, use the following commands. However, if deploying to the live site, be sure to switch both your local folder and shared.goodcity folders to the `live` branch first. This will ensure the correct code is built manually.

    cap staging deploy
    cap production deploy

Note you will need to have your SSH key installed on the destination servers before deployment will work.

## Upgrading Ember CLI
Documentation has moved to https://github.com/crossroads/shared.goodcity/blob/master/docs/upgrading-ember.md

## Cordova
CircleCI will automatically build apps for `master` and `live` branches. However, if you wish to do this manually you can use the following commands.

* Switch your admin.goodcity and shared.goodcity folders to the correct branch (usually `master` or `live`)
* Run `rake app:build` or `rake production android app:build` (see `Rakefile` for full command options)
* Run `rake testfairy:upload` if you wish to push the app to Testfairy.

Note: this is the same command as run on CircleCI. If you don't specify a platform, it will choose based on your current operating system. It will assume `staging` environment unless you specific otherwise.

Documentation has moved to https://github.com/crossroads/shared.goodcity/blob/master/docs/cordova.md

## Development Notes
Documentation has moved to https://github.com/crossroads/shared.goodcity/blob/master/docs/development-notes.md
