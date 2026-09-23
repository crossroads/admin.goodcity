# Admin App Changelog

All notable changes to the Admin app are documented here, newest first.

**Legend:** ✨ Feature &nbsp;·&nbsp; 🐛 Fix &nbsp;·&nbsp; ⬆️ Upgrade &nbsp;·&nbsp; 🗑️ Removed

---

## v0.27.0

- ⬆️ Update Cordova Android and Cordova iOS
- ⬆️ Update fastlane and shared-goodcity dependencies
- ⬆️ Update CI workflow jobs

## v0.26.5

- ✨ Add option to disable in-app van booking

## v0.26.4

- 🐛 Fix senderId null issue (via shared.goodcity upgrade)
- ⬆️ Upgrade ruby gems

## v0.26.3

- ⬆️ Update to Android API 35

## v0.26.2

- ⬆️ Update CI config to Xcode 16
- ⬆️ Change Ruby versions to 3.3.5

## v0.26.1

- ⬆️ Update Cordova to use Node 22

## v0.26.0

- ⬆️ Update Cordova Android to 13
- ⬆️ Plugin updates
- ⬆️ CI config updates

## v0.25.0

- 🗑️ Remove yarn offline mirror code for now (wasn't working well with CI builds)
- 🗑️ Remove bower_components from source control (also not working well with CI builds)
- ⬆️ Update to Xcode 15 / iOS SDK 17

## v0.24.4

- ✨ Add Donation Reference Number to transport screen
- ✨ Update Crossroads' contact number
- ✨ Setup yarn offline mirror
- ⬆️ Update documentation to use local yarn version
- 🗑️ Check in bower_components to remove external dependency
- 🐛 Fix image size in Receive Packages reverted to 120px (had changed to 300px)

## v0.24.3

- ✨ Add ability to load images from Azure Storage rather than Cloudinary

## v0.24.2

- 🐛 Fix bug in Chinese date selector (via shared.goodcity)
- ✨ Increase visibility of validation errors

## v0.24.1

- ✨ Add translations for account deletion
- ⬆️ Bump shared.goodcity to include van booking schedule validations and clickable icons

## v0.24.0

- ✨ Add ability for users to delete their accounts

## v0.23.0

- 🐛 Bug fix release
- ⬆️ Update cordova@12, cordova-android@12, cordova-ios@7
- ⬆️ Target Android API-33 and iOS 13 (Xcode 14)
