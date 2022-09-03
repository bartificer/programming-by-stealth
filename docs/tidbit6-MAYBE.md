# PBS Tibit 6 of Y — Lessons Learned from Porting This-Ti.me to Webpack

TO DO

## Matching Podcast Episode

TO DO

## Preparation — re-factor all-in-one HTML File to 3 Files

index.html → src/index.html + src/index.js + src/index.css

## Phase 1 — Straight Migration to Webpack

### Init NPM
```sh
npm init
```

### Install all dependencies from NPM

Need to fall back to Bootstrap 4.2.1 (latest 4.* caused odd bugs!)

```sh
npm install --save bootstrap@4.2.1
```

Need to fall back to Font Awesome 5

```sh
npm install --save @fortawesome/fontawesome-free@5
```

Need to fall back to JSCookie 2

```sh
npm install --save js-cookie@2
```

Need the version of Moment.js with timezone support built in

```sh
npm install --save moment-timezone
```

Other libs were fine at full current version:

```sh
npm install --save jquery bootstrap-4-autocomplete moment-timezone tempusdominus-bootstrap-4 urijs mustache is_js @bartificer/human-join

### Install Web pack

```sh
npm install --save-dev webpack webpack-cli css-loader style-loader copy-webpack-plugin
```

```json
{
  "name": "this-ti.me",
  "version": "1.0.0",
  "description": "The code for the this-ti.me website",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "build": "npx webpack --mode=production",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bbusschots/this-ti.me.git"
  },
  "keywords": [
    "JavaScript",
    "timezones"
  ],
  "author": "Bart Busschots",
  "license": "BSD-3-Clause",
  "bugs": {
    "url": "https://github.com/bbusschots/this-ti.me/issues"
  },
  "homepage": "https://github.com/bbusschots/this-ti.me#readme",
  "dependencies": {
    "@bartificer/human-join": "^1.1.3",
    "@fortawesome/fontawesome-free": "^5.15.4",
    "bootstrap": "4.2.1",
    "bootstrap-4-autocomplete": "^1.3.2",
    "is_js": "^0.9.0",
    "jquery": "^3.6.0",
    "js-cookie": "^2.2.1",
    "moment": "^2.29.4",
    "mustache": "^4.2.0",
    "tempusdominus-bootstrap-4": "^5.39.2",
    "urijs": "^1.19.11"
  },
  "devDependencies": {
    "copy-webpack-plugin": "^11.0.0",
    "css-loader": "^6.7.1",
    "style-loader": "^3.3.1",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0"
  }
}
```

## Configure Webpack (Optimise by splitting into two entry points - head and body)




## TO DO

Migrate to new is-js replacement

