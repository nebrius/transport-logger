## 1.0.1
* Cleaned up code formatting in documentation examples
* Updated URLs

## 1.0.0
* Switched to semver versioning (this is NOT a breaking change)
* Moved code to GitHub

## 0.1.6

### Miscellaneous
* Updated package to point to new repo

## 0.1.5

### Bug fixes
* Fixed a bug where maxLines couldn't be retroactively applied properly to logs with more than maxLines

## 0.1.4

### New Features
* Added the ability to archive logs after they reach a certain size

## 0.1.3

### New Features
* Introduced support for named transports. With named transports, you can specify a separate log message for each transport.

## 0.1.2

### New Features
* You can now pass in something falsey for the minLevel, which means don't log anything. Useful if you want a --silent flag in your app.

## 0.1.1

### New Features
* If logging to a file in a folder that does not exist, that folder and any non-existent parent folders are created on the fly
