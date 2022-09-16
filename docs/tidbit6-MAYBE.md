# PBS Tibit 6 of Y — A Real-World Webpack Case Study

In the main series we recently dedicated two instalments (TO DO - LINKS) to using [Webpack](https://webpack.js.org/) to bundle a website or web app. In the instalments we used a very simplistic example to help keep things clear. The example worked, but it left me wondering what it would be like to migrate an existing real-world web app to Webpack. I want to make some improvements to [this-ti.me](https://this-ti.me) in the coming months, and I don't want to put any time into a non-webpacked project anymore, so I decided to port this existing app to Webpack as a real-world case study. In the main series we never aim to cover any of our topics exhaustively, instead, we cover the basics in the expectation that that will arm you all with enough knowledge to learn the specific advanced features you need from the documentation and other online resources. With that in mind I fully expected to have to learn at least some new Webpack skills to get the site working well, and that's exactly what happened. In this tidbit I'll share my journey, and what I learned along the way.

## Matching Podcast Episode

TO DO

## The Original Code

The code before I started the migration was pretty much un-changed since it was developed as my sample solution to the challenge set at the end of instalment TO DO, and described in instalment TO DO.

The entire codebase was self-contained within a single `index.html` file. All custom CSS and JavaScript was embedded in `<style>` and `<script>` tags, all the [Mustache templates](https://github.com/janl/mustache.js) embedded in `<script type="html">` tags, and all 3rd-party CSS, JavaScript, and web fonts loaded from CDNs.

Before starting the code was already managed in Git, with the entire repo contents published as a website using GitHub pages.

## Preparation — Re-Factor to Separate Files

To ensure I could always roll back my changes, the very first thing I did was switch to a new branch named `chore-migrateToWebpack`.

To use Webpack I needed to switch the repo from publishing the entire thing as a website to publishing just a single folder, docs, so the first step was to move `index.html` to `src/index.html`.

For Webpack to be able to bundle the code the CSS and the JavaScript needed to come out of the HTML file. To that end I made the following changes:

1. I moved all the custom CSS from `src/index.html` to `src/index.css` and replaced the `<style>` tag with a `<link rel="stylesheet">` tag.
2. I moved all my own JavaScript from `src/index.html` to `src/index.js` and updated the `<script>`  tag to use an `src` attribute to load the code from the newly created file.

So, the starting point for the migration to Webpack was as follows:

1. `src/index.html` containing the HTML markup, the Mustache templates, and importing my own code from `src/index.css` & `src/index.js`, and all third-party CSS, JavaScript and web fonts from various CDNs.
2. `src/index.css` containing my CSS code
3. `src/index.js` containing my JavaScript code

## Initialise NPM & Webpack

To get either Webpack itself, or any of the dependencies currently loaded from CDNs, the first step is to turn the repo into a NodeJS package:

```sh
npm init
```

Next, install Webpack itself:

```sh
npm install --save-dev  webpack webpack-cli copy-webpack-plugin css-loader style-loader
```

## Find & Install Each Dependency

Before I committed myself too much, I made sure each and every dependency I was including via a CDN was available from NPM, thankfully, they all were 😅

### Installing Specific Version of Dependencies

So far, we've always used NPM at the point in time when we first need a module, so we've always been happy with NPM's default behaviour of installing the latest versions of modules.

We know that NPM uses SemVer to ensure you don't automatically update between major versions and risk breaking changes, but the initial install is always the latest released version, and it's that major version that gets locked in as the project ages.

I wrote this site with Bootstrap 4, and re-implementing it in Bootstrap 5 is too big of a task to simply mix in with the migration to Webpack. By default, NPM would give me Bootstrap 5, so how do I tell it Bootstrap 4? Simple, post-fix the package name with an `@` symbol and as much of the version number as you want to specify. I started with simply:

```sh
npm install --save bootstrap@4
```

I needed to do something similar for Font Awesome and JS cookie:

```sh
npm install --save @fortawesome/fontawesome-free@5  js-cookie@2
```

By putting only one number after the `@` I'm in effect saying *'give me the most recent minor and patch version under this major version'*. You can of course be more specific, and specify a major an minor version, or even a major, minor, and patch version. I ended up re-installing Bootstrap to a very specific version because I ran into an odd bug when I let it go to the latest Bootstrap 4:

```sh
npm remove bootstrap
npm install --save bootstrap@4.2.1
```

The reason for the weirdness became clear later — I was moving each dependency one-by-one and re-building and testing in between, and at one point I had the Bootstrap CSS from NPM, and the Bootstrap JS from the CDN, and they were at different versions. As soon as I forced NPM to use the identical version to the one I was getting from the CDN sanity returned!

One last little gotcha in the dependencies is that when using a CDN you use a pair of `<script>` tags to get MomentJS with timezone support, with NPM you get both together in one package:

```sh
npm install --save moment-timezone
```

LEFT OFF HERE!!!

NEXT STEP — go back and insert the webpack config!

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
    "bootstrap": "^4.2.1",
    "bootstrap-4-autocomplete": "^1.3.2",
    "is_js": "^0.9.0",
    "jquery": "^3.6.0",
    "js-cookie": "^2.2.1",
    "moment-timezone": "^0.5.37",
    "mustache": "^4.2.0",
    "popper.js": "^1.16.1",
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

```js
// Needed hackery to get __filename and __dirname in ES6 mode
// see: https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import webpack's standard functionality
import webpack from 'webpack';

// import the Webpack copy plugin
import CopyPlugin from 'copy-webpack-plugin';

// export the Webpack config
export default {
    entry: {
        head: './src/index-head.js', // will be imported inside the header — CSS only
        body: './src/index-body.js', // will be imported at the very bottom of the body — JavaScript only
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'bundle-[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                type: 'asset/inline',
                generator: {
					filename: 'webfonts/[hash][ext][query]'
				}
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "index.html" }
            ],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            moment: 'moment'
        })
    ]
};
```

## Refactor Mustache templates to source assets

DONE

## Replace `is_js` with `is-it-check`

```sh
npm remove is_js
npm install --save is-it-check
```

```js
import is from 'is-it-check';
```

## clean the output folder

```js
clean: true
```

## Refactor bundle to shrink it

DONE

## Update Dependencies

```sh
npm outdated
```

```sh
npm update jquery bootstrap
```

Minor + patch only!

Updating Bootstrap to the latest bootstrap 4 added a funny bug where the tabs became disconnected — fix was to remove the bottom margin with mb-0 on each tab.
